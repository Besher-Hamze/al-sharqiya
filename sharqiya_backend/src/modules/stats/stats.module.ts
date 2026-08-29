import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ContactMessage,
  ContactMessageSchema,
} from '../contact/schemas/contact-message.schema';
import { Album, AlbumSchema } from '../gallery/schemas/album.schema';
import { Media, MediaSchema } from '../media/schemas/media.schema';
import { Project, ProjectSchema } from '../projects/schemas/project.schema';
import {
  QuoteRequest,
  QuoteRequestSchema,
} from '../quotes/schemas/quote-request.schema';
import { Service, ServiceSchema } from '../services/schemas/service.schema';
import {
  Testimonial,
  TestimonialSchema,
} from '../testimonials/schemas/testimonial.schema';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Service.name, schema: ServiceSchema },
      { name: Project.name, schema: ProjectSchema },
      { name: Album.name, schema: AlbumSchema },
      { name: Media.name, schema: MediaSchema },
      { name: Testimonial.name, schema: TestimonialSchema },
      { name: QuoteRequest.name, schema: QuoteRequestSchema },
      { name: ContactMessage.name, schema: ContactMessageSchema },
    ]),
  ],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
