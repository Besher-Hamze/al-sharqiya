import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
  LocalizedString,
  LocalizedStringSchema,
} from '../../../common/schemas/localized-string.schema';

export type TestimonialDocument = HydratedDocument<Testimonial>;

@Schema({ collection: 'testimonials', timestamps: true })
export class Testimonial {
  @Prop({ required: true })
  name: string;

  @Prop({ type: LocalizedStringSchema })
  role?: LocalizedString;

  @Prop({ type: LocalizedStringSchema })
  company?: LocalizedString;

  @Prop({ type: LocalizedStringSchema, required: true })
  text: LocalizedString;

  @Prop({ type: Number, min: 1, max: 5, default: 5 })
  rating: number;

  /** Renamed from isApproved for consistency with the other content types. */
  @Prop({ default: false })
  isPublished: boolean;

  @Prop({ default: 0 })
  order: number;
}

export const TestimonialSchema = SchemaFactory.createForClass(Testimonial);
TestimonialSchema.index({ isPublished: 1, order: 1 });
