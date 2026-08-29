import { NotFoundException } from '@nestjs/common';
import { Model, UpdateQuery } from 'mongoose';
import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { ReorderDto } from '../dto/reorder.dto';
import { rethrowDuplicateKey, searchFilter } from '../helpers/mongo.helper';
import {
  buildPaginatedResult,
  PaginatedResult,
  parseSort,
} from '../helpers/pagination.helper';

/**
 * Shared CRUD behaviour for ordered, publishable, slug-addressed content.
 * Modules extend this and add only their domain-specific queries.
 */
export abstract class BaseContentService<T> {
  protected constructor(
    protected readonly model: Model<any>,
    protected readonly entityName: string,
    protected readonly searchPaths: string[],
    protected readonly defaultSort: Record<string, 1 | -1> = { order: 1 },
  ) {}

  async findPublished(): Promise<T[]> {
    return this.model.find({ isPublished: true }).sort(this.defaultSort).lean();
  }

  async findPublishedBySlug(slug: string): Promise<T> {
    const doc = await this.model.findOne({ slug, isPublished: true }).lean();
    if (!doc) {
      throw new NotFoundException(`${this.entityName} '${slug}' not found`);
    }
    return doc as T;
  }

  async findAllAdmin(
    query: PaginationQueryDto,
  ): Promise<PaginatedResult<T>> {
    const { page, limit } = query;
    const filter = searchFilter(query.search, this.searchPaths);
    const sort = parseSort(query.sort, this.defaultSort);
    const [data, total] = await Promise.all([
      this.model
        .find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      this.model.countDocuments(filter),
    ]);
    return buildPaginatedResult(data as T[], total, page, limit);
  }

  async findByIdAdmin(id: string): Promise<T> {
    const doc = await this.model.findById(id).lean();
    if (!doc) throw new NotFoundException(`${this.entityName} not found`);
    return doc as T;
  }

  async create(dto: object): Promise<T> {
    try {
      const created = await this.model.create(dto);
      return created.toObject() as T;
    } catch (error) {
      rethrowDuplicateKey(error, this.entityName);
    }
  }

  async update(id: string, dto: object): Promise<T> {
    try {
      const doc = await this.model
        .findByIdAndUpdate(id, dto as UpdateQuery<unknown>, {
          new: true,
          runValidators: true,
        })
        .lean();
      if (!doc) throw new NotFoundException(`${this.entityName} not found`);
      return doc as T;
    } catch (error) {
      rethrowDuplicateKey(error, this.entityName);
    }
  }

  async setPublished(id: string, isPublished: boolean): Promise<T> {
    const doc = await this.model
      .findByIdAndUpdate(id, { isPublished }, { new: true })
      .lean();
    if (!doc) throw new NotFoundException(`${this.entityName} not found`);
    return doc as T;
  }

  async reorder(dto: ReorderDto): Promise<{ updated: number }> {
    const result = await this.model.bulkWrite(
      dto.items.map((item) => ({
        updateOne: {
          filter: { _id: item.id },
          update: { $set: { order: item.order } },
        },
      })),
    );
    return { updated: result.modifiedCount };
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const doc = await this.model.findByIdAndDelete(id);
    if (!doc) throw new NotFoundException(`${this.entityName} not found`);
    return { deleted: true };
  }
}
