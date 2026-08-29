import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomBytes } from 'crypto';
import { mkdir, unlink, writeFile } from 'fs/promises';
import { Model } from 'mongoose';
import { join, normalize, sep } from 'path';
import sharp from 'sharp';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { searchFilter } from '../../common/helpers/mongo.helper';
import {
  buildPaginatedResult,
  PaginatedResult,
} from '../../common/helpers/pagination.helper';
import { UpdateMediaDto, UploadMediaDto } from './dto/media.dto';
import { Media, MediaDocument } from './schemas/media.schema';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'application/pdf',
  'video/mp4',
]);

/** Raster formats we re-encode to webp; everything else is stored as-is. */
const SHARP_PROCESSABLE = new Set(['image/jpeg', 'image/png', 'image/webp']);

const EXTENSIONS: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/svg+xml': '.svg',
  'application/pdf': '.pdf',
  'video/mp4': '.mp4',
};

const UPLOADS_ROOT = join(process.cwd(), 'uploads');
const MAX_WIDTH = 1920;
const THUMB_WIDTH = 400;
const WEBP_QUALITY = 82;

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  constructor(
    @InjectModel(Media.name) private readonly mediaModel: Model<MediaDocument>,
  ) {}

  async upload(file: Express.Multer.File, dto: UploadMediaDto): Promise<Media> {
    if (!file) throw new BadRequestException('No file provided');
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      throw new BadRequestException(
        `Unsupported file type '${file.mimetype}'. Allowed: jpeg, png, webp, gif, svg, pdf, mp4`,
      );
    }

    const now = new Date();
    const folder = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const dir = join(UPLOADS_ROOT, 'media', folder);
    await mkdir(dir, { recursive: true });

    const baseName = randomBytes(12).toString('hex');
    let filename: string;
    let thumbUrl = '';
    let width: number | null = null;
    let height: number | null = null;
    let size = file.size;

    if (SHARP_PROCESSABLE.has(file.mimetype)) {
      filename = `${baseName}.webp`;
      const webp = await sharp(file.buffer)
        .rotate()
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY })
        .toBuffer();
      await writeFile(join(dir, filename), webp);
      size = webp.length;

      const meta = await sharp(webp).metadata();
      width = meta.width ?? null;
      height = meta.height ?? null;

      const thumbName = `${baseName}.thumb.webp`;
      const thumb = await sharp(file.buffer)
        .rotate()
        .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY })
        .toBuffer();
      await writeFile(join(dir, thumbName), thumb);
      thumbUrl = `/uploads/media/${folder}/${thumbName}`;
    } else {
      filename = `${baseName}${EXTENSIONS[file.mimetype]}`;
      await writeFile(join(dir, filename), file.buffer);
      if (file.mimetype === 'image/gif') {
        const meta = await sharp(file.buffer).metadata();
        width = meta.width ?? null;
        height = meta.height ?? null;
      }
    }

    const created = await this.mediaModel.create({
      filename,
      url: `/uploads/media/${folder}/${filename}`,
      thumbUrl,
      mimeType: file.mimetype,
      size,
      width,
      height,
      alt: { en: dto.altEn ?? '', ar: dto.altAr ?? '' },
      folder: `media/${folder}`,
    });
    return created.toObject();
  }

  async findAll(query: PaginationQueryDto): Promise<PaginatedResult<Media>> {
    const { page, limit } = query;
    const filter = searchFilter(query.search, [
      'filename',
      'mimeType',
      'alt.en',
      'alt.ar',
    ]);
    const [data, total] = await Promise.all([
      this.mediaModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      this.mediaModel.countDocuments(filter),
    ]);
    return buildPaginatedResult(data, total, page, limit);
  }

  async update(id: string, dto: UpdateMediaDto): Promise<Media> {
    const doc = await this.mediaModel
      .findByIdAndUpdate(
        id,
        { alt: { en: dto.altEn ?? '', ar: dto.altAr ?? '' } },
        { new: true },
      )
      .lean();
    if (!doc) throw new NotFoundException('Media not found');
    return doc;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const doc = await this.mediaModel.findByIdAndDelete(id);
    if (!doc) throw new NotFoundException('Media not found');
    await Promise.all(
      [doc.url, doc.thumbUrl]
        .filter((url): url is string => Boolean(url))
        .map((url) => this.deleteFileByUrl(url)),
    );
    return { deleted: true };
  }

  private async deleteFileByUrl(url: string): Promise<void> {
    const relative = url.replace(/^\/uploads\//, '');
    const filePath = normalize(join(UPLOADS_ROOT, relative));
    // Path-traversal guard: never unlink outside uploads/.
    if (!filePath.startsWith(UPLOADS_ROOT + sep)) return;
    try {
      await unlink(filePath);
    } catch (err) {
      this.logger.warn(
        `Could not delete file ${filePath}: ${(err as Error).message}`,
      );
    }
  }
}
