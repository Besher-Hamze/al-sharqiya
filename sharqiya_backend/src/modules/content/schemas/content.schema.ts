import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export const CONTENT_KEYS = ['homepage', 'about'] as const;
export type ContentKey = (typeof CONTENT_KEYS)[number];

export type ContentDocument = HydratedDocument<Content>;

/**
 * Free-form documents for composed pages (hero copy, stats, value blocks…).
 * Kept schemaless so the homepage can evolve without a migration.
 */
@Schema({ collection: 'contents', timestamps: true })
export class Content {
  @Prop({ required: true, unique: true, enum: CONTENT_KEYS })
  key: ContentKey;

  @Prop({ type: MongooseSchema.Types.Mixed, default: {} })
  data: Record<string, unknown>;
}

export const ContentSchema = SchemaFactory.createForClass(Content);
