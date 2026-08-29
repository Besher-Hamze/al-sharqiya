import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseContentService } from '../../common/services/base-content.service';
import { Page, PageDocument } from './schemas/page.schema';

@Injectable()
export class PagesService extends BaseContentService<Page> {
  constructor(
    @InjectModel(Page.name) private readonly pageModel: Model<PageDocument>,
  ) {
    super(pageModel, 'Page', ['slug', 'title.en', 'title.ar']);
  }
}
