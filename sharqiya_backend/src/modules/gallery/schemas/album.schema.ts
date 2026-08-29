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

export type AlbumDocument = HydratedDocument<Album>;

@Schema({ collection: 'galleryalbums', timestamps: true })
export class Album {
  @Prop({ required: true, unique: true, trim: true })
  slug: string;

  @Prop({ type: LocalizedStringSchema, required: true })
  title: LocalizedString;

  @Prop({ type: LocalizedStringSchema })
  description?: LocalizedString;

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: '' })
  coverImage: string;

  @Prop({ type: [ContentImageSchema], default: [] })
  images: ContentImage[];

  @Prop({ default: true })
  isPublished: boolean;
}

export const AlbumSchema = SchemaFactory.createForClass(Album);
AlbumSchema.index({ isPublished: 1, order: 1 });
