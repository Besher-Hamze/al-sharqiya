import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { searchFilter } from '../../common/helpers/mongo.helper';
import {
  buildPaginatedResult,
  PaginatedResult,
} from '../../common/helpers/pagination.helper';
import {
  CreateQuoteRequestDto,
  UpdateQuoteRequestDto,
} from './dto/quote-request.dto';
import {
  QuoteRequest,
  QuoteRequestDocument,
  QuoteStatus,
} from './schemas/quote-request.schema';

@Injectable()
export class QuotesService {
  private readonly logger = new Logger(QuotesService.name);

  constructor(
    @InjectModel(QuoteRequest.name)
    private readonly quoteModel: Model<QuoteRequestDocument>,
  ) {}

  async create(dto: CreateQuoteRequestDto): Promise<{ success: boolean }> {
    const created = await this.quoteModel.create(dto);
    this.logger.log(
      `New quote request ${created._id.toString()} from ${dto.name} (${dto.phone})`,
    );
    return { success: true };
  }

  async findAll(
    query: PaginationQueryDto,
    status?: QuoteStatus,
  ): Promise<PaginatedResult<QuoteRequest>> {
    const { page, limit } = query;
    const filter: FilterQuery<QuoteRequestDocument> = {
      ...searchFilter(query.search, ['name', 'phone', 'email', 'company']),
    };
    if (status) filter.status = status;

    const [data, total] = await Promise.all([
      this.quoteModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      this.quoteModel.countDocuments(filter),
    ]);
    return buildPaginatedResult(data, total, page, limit);
  }

  async countNew(): Promise<{ count: number }> {
    return { count: await this.quoteModel.countDocuments({ status: 'new' }) };
  }

  async update(
    id: string,
    dto: UpdateQuoteRequestDto,
  ): Promise<QuoteRequest> {
    const doc = await this.quoteModel
      .findByIdAndUpdate(id, dto, { new: true, runValidators: true })
      .lean();
    if (!doc) throw new NotFoundException('Quote request not found');
    return doc;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const doc = await this.quoteModel.findByIdAndDelete(id);
    if (!doc) throw new NotFoundException('Quote request not found');
    return { deleted: true };
  }
}
