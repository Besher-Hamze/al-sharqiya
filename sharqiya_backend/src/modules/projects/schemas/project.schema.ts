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

export type ProjectDocument = HydratedDocument<Project>;

@Schema({ collection: 'projects', timestamps: true })
export class Project {
  @Prop({ required: true, unique: true, trim: true })
  slug: string;

  @Prop({ default: 0 })
  order: number;

  @Prop({ type: LocalizedStringSchema, required: true })
  title: LocalizedString;

  @Prop({ type: LocalizedStringSchema, required: true })
  excerpt: LocalizedString;

  @Prop({ type: LocalizedStringSchema, required: true })
  description: LocalizedString;

  /** Slug of the owning service line, used for portfolio filtering. */
  @Prop({ required: true, index: true })
  serviceSlug: string;

  @Prop({ type: LocalizedStringSchema })
  client?: LocalizedString;

  @Prop({ type: LocalizedStringSchema })
  location?: LocalizedString;

  /** Free text so units stay editable, e.g. "10,000 m²". */
  @Prop({ default: '' })
  area: string;

  @Prop({ type: Number, default: null })
  year: number | null;

  @Prop({ type: [LocalizedStringSchema], default: [] })
  scope: LocalizedString[];

  @Prop({ default: '' })
  coverImage: string;

  @Prop({ type: [ContentImageSchema], default: [] })
  gallery: ContentImage[];

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop({ default: true })
  isPublished: boolean;

  @Prop({ type: SeoSchema })
  seo?: Seo;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
ProjectSchema.index({ isPublished: 1, order: 1 });
ProjectSchema.index({ isPublished: 1, isFeatured: -1, order: 1 });
