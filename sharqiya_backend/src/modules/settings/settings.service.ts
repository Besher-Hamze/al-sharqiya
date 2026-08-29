import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { Settings, SettingsDocument } from './schemas/settings.schema';

const FALLBACK: Partial<Settings> = {
  siteName: { en: 'Al-Sharqiya', ar: 'الشرقية' },
  tagline: { en: '', ar: '' },
  foundedYear: 1986,
};

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(Settings.name)
    private readonly settingsModel: Model<SettingsDocument>,
  ) {}

  /** Settings are a singleton — the first document is the live one. */
  async find(): Promise<Partial<Settings>> {
    const doc = await this.settingsModel.findOne().lean();
    return doc ?? FALLBACK;
  }

  async update(dto: UpdateSettingsDto): Promise<Partial<Settings>> {
    const existing = await this.settingsModel.findOne().select('_id');
    if (!existing) {
      const created = await this.settingsModel.create({
        ...FALLBACK,
        ...dto,
      });
      return created.toObject();
    }
    const doc = await this.settingsModel
      .findByIdAndUpdate(existing._id, dto, { new: true, runValidators: true })
      .lean();
    return doc ?? FALLBACK;
  }
}
