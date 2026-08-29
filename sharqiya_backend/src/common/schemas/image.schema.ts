import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  LocalizedString,
  LocalizedStringSchema,
} from './localized-string.schema';

/** A picture referenced from content, with bilingual alt text and caption. */
@Schema({ _id: false })
export class ContentImage {
  @Prop({ required: true })
  src: string;

  @Prop({ type: LocalizedStringSchema, default: () => ({ en: '', ar: '' }) })
  alt: LocalizedString;

  @Prop({ type: LocalizedStringSchema })
  caption?: LocalizedString;

  @Prop({ default: 0 })
  order: number;
}

export const ContentImageSchema = SchemaFactory.createForClass(ContentImage);
