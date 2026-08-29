import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
  LocalizedString,
  LocalizedStringSchema,
} from '../../../common/schemas/localized-string.schema';
import { Seo, SeoSchema } from '../../../common/schemas/seo.schema';

@Schema({ _id: false })
export class PageSection {
  @Prop({ type: LocalizedStringSchema, required: true })
  heading: LocalizedString;

  @Prop({ type: LocalizedStringSchema, required: true })
  body: LocalizedString;
}

export const PageSectionSchema = SchemaFactory.createForClass(PageSection);

export type PageDocument = HydratedDocument<Page>;

/** Static / legal pages such as privacy and terms. */
@Schema({ collection: 'pages', timestamps: true })
export class Page {
  @Prop({ required: true, unique: true, trim: true })
  slug: string;

  @Prop({ default: 0 })
  order: number;

  @Prop({ type: LocalizedStringSchema, required: true })
  title: LocalizedString;

  @Prop({ type: [PageSectionSchema], default: [] })
  sections: PageSection[];

  @Prop({ default: true })
  isPublished: boolean;

  @Prop({ type: SeoSchema })
  seo?: Seo;
}

export const PageSchema = SchemaFactory.createForClass(Page);
