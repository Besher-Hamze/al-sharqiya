import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import {
  rethrowDuplicateKey,
  searchFilter,
} from '../../common/helpers/mongo.helper';
import {
  buildPaginatedResult,
  PaginatedResult,
  parseSort,
} from '../../common/helpers/pagination.helper';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { User, UserDocument } from './schemas/user.schema';

const BCRYPT_COST = 12;
const PUBLIC_FIELDS = '-passwordHash';

export type SafeUser = Omit<User, 'passwordHash'>;

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  /** Includes the password hash — only for the auth flow. */
  async findByEmailWithPassword(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase().trim() });
  }

  async findByIdInternal(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id);
  }

  async findAll(
    query: PaginationQueryDto,
  ): Promise<PaginatedResult<SafeUser>> {
    const { page, limit } = query;
    const filter = searchFilter(query.search, ['name', 'email']);
    const sort = parseSort(query.sort, { createdAt: -1 });
    const [data, total] = await Promise.all([
      this.userModel
        .find(filter)
        .select(PUBLIC_FIELDS)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      this.userModel.countDocuments(filter),
    ]);
    return buildPaginatedResult(data, total, page, limit);
  }

  async create(dto: CreateUserDto): Promise<SafeUser> {
    try {
      const created = await this.userModel.create({
        email: dto.email,
        name: dto.name,
        role: dto.role ?? 'editor',
        isActive: dto.isActive ?? true,
        passwordHash: await bcrypt.hash(dto.password, BCRYPT_COST),
      });
      const { passwordHash, ...safe } = created.toObject();
      void passwordHash;
      return safe as SafeUser;
    } catch (error) {
      rethrowDuplicateKey(error, 'User');
    }
  }

  async update(
    id: string,
    dto: UpdateUserDto,
    actingUserId: string,
  ): Promise<SafeUser> {
    const { password, ...rest } = dto;
    const update: Record<string, unknown> = { ...rest };

    if (password) {
      update.passwordHash = await bcrypt.hash(password, BCRYPT_COST);
    }
    if (id === actingUserId && rest.isActive === false) {
      throw new BadRequestException('You cannot deactivate your own account');
    }

    try {
      const doc = await this.userModel
        .findByIdAndUpdate(id, update, { new: true, runValidators: true })
        .select(PUBLIC_FIELDS)
        .lean();
      if (!doc) throw new NotFoundException('User not found');
      return doc;
    } catch (error) {
      rethrowDuplicateKey(error, 'User');
    }
  }

  async remove(
    id: string,
    actingUserId: string,
  ): Promise<{ deleted: boolean }> {
    if (id === actingUserId) {
      throw new BadRequestException('You cannot delete your own account');
    }
    const doc = await this.userModel.findByIdAndDelete(id);
    if (!doc) throw new NotFoundException('User not found');
    return { deleted: true };
  }
}
