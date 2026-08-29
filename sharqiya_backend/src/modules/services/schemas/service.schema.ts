import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
  ContentImage,
  ContentImageSchema,
} from '../../../common/schemas/image.schema';
import {
  LocalizedString,
  LocalizedStringSchema,
} from '../../../common/schemas/localized-string.schema';
import { Seo, SeoSchema } from '../../../common/schemas/seo.schema';

/** A titled prose block inside a service page, optionally illustrated. */
@Schema({ _id: false })
export class ServiceSection {
  @Prop({ type: LocalizedStringSchema, required: true })
  heading: LocalizedString;

  @Prop({ type: LocalizedStringSchema, required: true })
  body: LocalizedString;

  @Prop({ type: [ContentImageSchema], default: [] })
  images: ContentImage[];
}

export const ServiceSectionSchema =
  SchemaFactory.createForClass(ServiceSection);

/** Key/value technical detail, e.g. "Systems" → "Epoxy, PU, micro cement". */
@Schema({ _id: false })
export class ServiceSpec {
  @Prop({ type: LocalizedStringSchema, required: true })
  label: LocalizedString;

  @Prop({ type: LocalizedStringSchema, required: true })
  value: LocalizedString;
}

export const ServiceSpecSchema = SchemaFactory.createForClass(ServiceSpec);

export type ServiceDocument = HydratedDocument<Service>;

@Schema({ collection: 'services', timestamps: true })
export class Service {
  @Prop({ required: true, unique: true, trim: true })
  slug: string;

  @Prop({ default: 0 })
  order: number;

  @Prop({ type: LocalizedStringSchema, required: true })
  name: LocalizedString;

  @Prop({ type: LocalizedStringSchema, required: true })
  excerpt: LocalizedString;

  @Prop({ type: LocalizedStringSchema, required: true })
  description: LocalizedString;

  /** Lucide icon name rendered by the frontend. */
  @Prop({ default: 'layers' })
  icon: string;

  @Prop({ type: [LocalizedStringSchema], default: [] })
  features: LocalizedString[];

  @Prop({ type: [ServiceSpecSchema], default: [] })
  specs: ServiceSpec[];

  @Prop({ type: [ServiceSectionSchema], default: [] })
  sections: ServiceSection[];

  @Prop({ default: '' })
  coverImage: string;

  @Prop({ type: [ContentImageSchema], default: [] })
  gallery: ContentImage[];

  @Prop({ default: true })
  isPublished: boolean;

  @Prop({ type: SeoSchema })
  seo?: Seo;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
ServiceSchema.index({ isPublished: 1, order: 1 });
