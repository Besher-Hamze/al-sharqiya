import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseContentService } from '../../common/services/base-content.service';
import {
  Testimonial,
  TestimonialDocument,
} from './schemas/testimonial.schema';

@Injectable()
export class TestimonialsService extends BaseContentService<Testimonial> {
  constructor(
    @InjectModel(Testimonial.name)
    private readonly testimonialModel: Model<TestimonialDocument>,
  ) {
    super(testimonialModel, 'Testimonial', ['name', 'company.en', 'text.en']);
  }
}
