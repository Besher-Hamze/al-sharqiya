import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type QuoteStatus =
  | 'new'
  | 'contacted'
  | 'quoted'
  | 'won'
  | 'lost';

export const QUOTE_STATUSES: QuoteStatus[] = [
  'new',
  'contacted',
  'quoted',
  'won',
  'lost',
];

export type PropertyType =
  | 'residential'
  | 'commercial'
  | 'industrial'
  | 'government'
  | 'other';

export const PROPERTY_TYPES: PropertyType[] = [
  'residential',
  'commercial',
  'industrial',
  'government',
  'other',
];

export type QuoteRequestDocument = HydratedDocument<QuoteRequest>;

/** A "request a quote" submission from the public site. */
@Schema({ collection: 'quoterequests', timestamps: true })
export class QuoteRequest {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ default: '', trim: true })
  email?: string;

  @Prop({ default: '' })
  company?: string;

  /** Service slugs the enquiry covers. */
  @Prop({ type: [String], default: [] })
  services: string[];

  @Prop({
    type: String,
    enum: PROPERTY_TYPES,
    default: 'other',
  })
  propertyType: PropertyType;

  @Prop({ default: '' })
  emirate?: string;

  /** Free text so the client can write "about 400 m2". */
  @Prop({ default: '' })
  area?: string;

  @Prop({ default: '' })
  message?: string;

  @Prop({ default: 'en' })
  locale: string;

  @Prop({ type: String, enum: QUOTE_STATUSES, default: 'new' })
  status: QuoteStatus;

  @Prop({ default: '' })
  adminNote?: string;

  createdAt?: Date;
}

export const QuoteRequestSchema = SchemaFactory.createForClass(QuoteRequest);
QuoteRequestSchema.index({ status: 1, createdAt: -1 });
