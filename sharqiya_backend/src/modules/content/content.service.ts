import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Content,
  CONTENT_KEYS,
  ContentDocument,
  ContentKey,
} from './schemas/content.schema';

@Injectable()
export class ContentService {
  constructor(
    @InjectModel(Content.name)
    private readonly contentModel: Model<ContentDocument>,
  ) {}

  private assertKey(key: string): ContentKey {
    if (!CONTENT_KEYS.includes(key as ContentKey)) {
      throw new BadRequestException(
        `Unknown content key '${key}'. Allowed: ${CONTENT_KEYS.join(', ')}`,
      );
    }
    return key as ContentKey;
  }

  async findByKey(key: string): Promise<Record<string, unknown>> {
    const doc = await this.contentModel
      .findOne({ key: this.assertKey(key) })
      .lean();
    return doc?.data ?? {};
  }

  async findAll(): Promise<Record<string, Record<string, unknown>>> {
    const docs = await this.contentModel.find().lean();
    return docs.reduce<Record<string, Record<string, unknown>>>(
      (acc, doc) => ({ ...acc, [doc.key]: doc.data }),
      {},
    );
  }

  async upsert(
    key: string,
    data: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    const doc = await this.contentModel
      .findOneAndUpdate(
        { key: this.assertKey(key) },
        { data },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      )
      .lean();
    return doc?.data ?? {};
  }
}
