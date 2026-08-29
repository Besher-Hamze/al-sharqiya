import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
  LocalizedString,
  LocalizedStringSchema,
} from '../../../common/schemas/localized-string.schema';

@Schema({ _id: false })
export class ContactInfo {
  @Prop({ default: '' })
  email: string;

  @Prop({ default: '' })
  phone: string;

  @Prop({ default: '' })
  phoneAlt: string;

  @Prop({ default: '' })
  whatsapp: string;

  @Prop({ type: LocalizedStringSchema })
  headOffice?: LocalizedString;
}
export const ContactInfoSchema = SchemaFactory.createForClass(ContactInfo);

@Schema({ _id: false })
export class SocialLinks {
  @Prop({ default: '' })
  instagram: string;

  @Prop({ default: '' })
  facebook: string;

  @Prop({ default: '' })
  linkedin: string;

  @Prop({ default: '' })
  tiktok: string;
}
export const SocialLinksSchema = SchemaFactory.createForClass(SocialLinks);

/** One branch in the emirate network. */
@Schema({ _id: false })
export class Branch {
  @Prop({ type: LocalizedStringSchema, required: true })
  city: LocalizedString;

  @Prop({ type: LocalizedStringSchema })
  address?: LocalizedString;

  @Prop({ default: '' })
  phone: string;

  @Prop({ default: '' })
  mapUrl: string;

  @Prop({ default: 0 })
  order: number;
}
export const BranchSchema = SchemaFactory.createForClass(Branch);

@Schema({ _id: false })
export class OpeningHour {
  @Prop({ type: LocalizedStringSchema, required: true })
  day: LocalizedString;

  @Prop({ default: '' })
  open: string;

  @Prop({ default: '' })
  close: string;

  @Prop({ default: false })
  closed: boolean;
}
export const OpeningHourSchema = SchemaFactory.createForClass(OpeningHour);

export type SettingsDocument = HydratedDocument<Settings>;

/** Singleton document holding site-wide configuration. */
@Schema({ collection: 'settings', timestamps: true })
export class Settings {
  @Prop({ type: LocalizedStringSchema, required: true })
  siteName: LocalizedString;

  @Prop({ type: LocalizedStringSchema })
  tagline: LocalizedString;

  @Prop({ type: LocalizedStringSchema })
  shortDescription: LocalizedString;

  @Prop({ type: ContactInfoSchema })
  contact: ContactInfo;

  @Prop({ type: SocialLinksSchema })
  social: SocialLinks;

  @Prop({ type: [BranchSchema], default: [] })
  branches: Branch[];

  @Prop({ type: [OpeningHourSchema], default: [] })
  openingHours: OpeningHour[];

  @Prop({ type: Number, default: 1986 })
  foundedYear: number;

  @Prop({ default: '' })
  logo: string;

  @Prop({ default: '' })
  tradeLicense: string;
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);
