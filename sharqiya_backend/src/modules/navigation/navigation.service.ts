import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateNavigationDto } from './dto/update-navigation.dto';
import { Navigation, NavigationDocument } from './schemas/navigation.schema';

const EMPTY: Navigation = { headerMenu: [], footerMenu: [], legalMenu: [] };

@Injectable()
export class NavigationService {
  constructor(
    @InjectModel(Navigation.name)
    private readonly navigationModel: Model<NavigationDocument>,
  ) {}

  async find(): Promise<Navigation> {
    const doc = await this.navigationModel.findOne().lean();
    return doc ?? EMPTY;
  }

  async update(dto: UpdateNavigationDto): Promise<Navigation> {
    const existing = await this.navigationModel.findOne().select('_id');
    if (!existing) {
      const created = await this.navigationModel.create(dto);
      return created.toObject();
    }
    const doc = await this.navigationModel
      .findByIdAndUpdate(existing._id, dto, { new: true, runValidators: true })
      .lean();
    return doc ?? EMPTY;
  }
}
