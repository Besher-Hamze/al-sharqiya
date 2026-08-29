import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { searchFilter } from '../../common/helpers/mongo.helper';
import {
  buildPaginatedResult,
  PaginatedResult,
} from '../../common/helpers/pagination.helper';
import {
  CreateContactMessageDto,
  UpdateContactMessageDto,
} from './dto/contact.dto';
import {
  ContactMessage,
  ContactMessageDocument,
} from './schemas/contact-message.schema';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    @InjectModel(ContactMessage.name)
    private readonly contactModel: Model<ContactMessageDocument>,
  ) {}

  async create(
    dto: CreateContactMessageDto,
  ): Promise<{ success: boolean }> {
    const created = await this.contactModel.create(dto);
    this.logger.log(
      `New contact message ${created._id.toString()} from ${dto.email}`,
    );
    return { success: true };
  }

  async findAll(
    query: PaginationQueryDto,
  ): Promise<PaginatedResult<ContactMessage>> {
    const { page, limit } = query;
    const filter = searchFilter(query.search, [
      'name',
      'email',
      'subject',
      'message',
    ]);
    const [data, total] = await Promise.all([
      this.contactModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      this.contactModel.countDocuments(filter),
    ]);
    return buildPaginatedResult(data, total, page, limit);
  }

  async countUnread(): Promise<{ count: number }> {
    return { count: await this.contactModel.countDocuments({ isRead: false }) };
  }

  async update(
    id: string,
    dto: UpdateContactMessageDto,
  ): Promise<ContactMessage> {
    const doc = await this.contactModel
      .findByIdAndUpdate(id, dto, { new: true })
      .lean();
    if (!doc) throw new NotFoundException('Message not found');
    return doc;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const doc = await this.contactModel.findByIdAndDelete(id);
    if (!doc) throw new NotFoundException('Message not found');
    return { deleted: true };
  }
}
