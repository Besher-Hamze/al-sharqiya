import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { searchFilter } from '../../common/helpers/mongo.helper';
import {
  buildPaginatedResult,
  PaginatedResult,
} from '../../common/helpers/pagination.helper';
import { AuditLog, AuditLogDocument } from './schemas/audit-log.schema';

export interface AuditEntry {
  userId: string;
  userEmail: string;
  method: string;
  path: string;
  entity: string;
  entityId: string | null;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    @InjectModel(AuditLog.name)
    private readonly auditModel: Model<AuditLogDocument>,
  ) {}

  /** Fire-and-forget: auditing must never break the request it describes. */
  record(entry: AuditEntry): void {
    void this.auditModel
      .create(entry)
      .catch((err: Error) =>
        this.logger.warn(`Could not write audit entry: ${err.message}`),
      );
  }

  async findAll(
    query: PaginationQueryDto,
  ): Promise<PaginatedResult<AuditLog>> {
    const { page, limit } = query;
    const filter = searchFilter(query.search, [
      'userEmail',
      'entity',
      'path',
    ]);
    const [data, total] = await Promise.all([
      this.auditModel
        .find(filter)
        .sort({ timestamp: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      this.auditModel.countDocuments(filter),
    ]);
    return buildPaginatedResult(data, total, page, limit);
  }
}
