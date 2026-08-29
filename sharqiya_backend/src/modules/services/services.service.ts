import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseContentService } from '../../common/services/base-content.service';
import { Service, ServiceDocument } from './schemas/service.schema';

@Injectable()
export class ServicesService extends BaseContentService<Service> {
  constructor(
    @InjectModel(Service.name)
    private readonly serviceModel: Model<ServiceDocument>,
  ) {
    super(serviceModel, 'Service', ['slug', 'name.en', 'name.ar']);
  }

  /** Lightweight list for navigation menus and quote-request pickers. */
  async findPublishedSummaries(): Promise<Partial<Service>[]> {
    return this.serviceModel
      .find({ isPublished: true })
      .select('slug name icon excerpt coverImage order')
      .sort({ order: 1 })
      .lean();
  }
}
