import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

/** Every user-facing string in the CMS is stored bilingually. */
@Schema({ _id: false })
export class LocalizedString {
  @Prop({ type: String, default: '' })
  en: string;

  @Prop({ type: String, default: '' })
  ar: string;
}

export const LocalizedStringSchema =
  SchemaFactory.createForClass(LocalizedString);
