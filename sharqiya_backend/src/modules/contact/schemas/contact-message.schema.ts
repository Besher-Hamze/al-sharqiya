import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ContactMessageDocument = HydratedDocument<ContactMessage>;

@Schema({ collection: 'contactmessages', timestamps: true })
export class ContactMessage {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true, lowercase: true })
  email: string;

  @Prop({ default: '' })
  phone?: string;

  @Prop({ default: '' })
  subject?: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: 'en' })
  locale: string;

  @Prop({ default: false })
  isRead: boolean;

  createdAt?: Date;
}

export const ContactMessageSchema =
  SchemaFactory.createForClass(ContactMessage);
ContactMessageSchema.index({ isRead: 1, createdAt: -1 });
