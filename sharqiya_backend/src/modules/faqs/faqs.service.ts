import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseContentService } from '../../common/services/base-content.service';
import { Faq, FaqDocument } from './schemas/faq.schema';

@Injectable()
export class FaqsService extends BaseContentService<Faq> {
  constructor(
    @InjectModel(Faq.name) private readonly faqModel: Model<FaqDocument>,
  ) {
    super(faqModel, 'FAQ', ['question.en', 'question.ar']);
  }
}
