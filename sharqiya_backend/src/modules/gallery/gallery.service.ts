import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseContentService } from '../../common/services/base-content.service';
import { Album, AlbumDocument } from './schemas/album.schema';

@Injectable()
export class GalleryService extends BaseContentService<Album> {
  constructor(
    @InjectModel(Album.name) private readonly albumModel: Model<AlbumDocument>,
  ) {
    super(albumModel, 'Album', ['slug', 'title.en', 'title.ar']);
  }
}
