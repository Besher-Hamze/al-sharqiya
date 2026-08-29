import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ContactMessage } from '../contact/schemas/contact-message.schema';
import { Album } from '../gallery/schemas/album.schema';
import { Media } from '../media/schemas/media.schema';
import { Project } from '../projects/schemas/project.schema';
import { QuoteRequest } from '../quotes/schemas/quote-request.schema';
import { Service } from '../services/schemas/service.schema';
import { Testimonial } from '../testimonials/schemas/testimonial.schema';

export interface DashboardOverview {
  counts: {
    services: number;
    servicesPublished: number;
    projects: number;
    projectsPublished: number;
    albums: number;
    media: number;
    testimonials: number;
    testimonialsPending: number;
  };
  quotes: {
    total: number;
    new: number;
    byStatus: { status: string; count: number }[];
  };
  messages: { total: number; unread: number };
  /** Quote requests per day for the last 30 days, oldest first. */
  quoteTrend: { date: string; count: number }[];
  recentQuotes: QuoteRequest[];
}

const TREND_DAYS = 30;

@Injectable()
export class StatsService {
  constructor(
    @InjectModel(Service.name) private readonly serviceModel: Model<Service>,
    @InjectModel(Project.name) private readonly projectModel: Model<Project>,
    @InjectModel(Album.name) private readonly albumModel: Model<Album>,
    @InjectModel(Media.name) private readonly mediaModel: Model<Media>,
    @InjectModel(Testimonial.name)
    private readonly testimonialModel: Model<Testimonial>,
    @InjectModel(QuoteRequest.name)
    private readonly quoteModel: Model<QuoteRequest>,
    @InjectModel(ContactMessage.name)
    private readonly contactModel: Model<ContactMessage>,
  ) {}

  async overview(): Promise<DashboardOverview> {
    const since = new Date();
    since.setHours(0, 0, 0, 0);
    since.setDate(since.getDate() - (TREND_DAYS - 1));

    const [
      services,
      servicesPublished,
      projects,
      projectsPublished,
      albums,
      media,
      testimonials,
      testimonialsPending,
      quotesTotal,
      quotesNew,
      quotesByStatus,
      messagesTotal,
      messagesUnread,
      trendRaw,
      recentQuotes,
    ] = await Promise.all([
      this.serviceModel.countDocuments(),
      this.serviceModel.countDocuments({ isPublished: true }),
      this.projectModel.countDocuments(),
      this.projectModel.countDocuments({ isPublished: true }),
      this.albumModel.countDocuments(),
      this.mediaModel.countDocuments(),
      this.testimonialModel.countDocuments(),
      this.testimonialModel.countDocuments({ isPublished: false }),
      this.quoteModel.countDocuments(),
      this.quoteModel.countDocuments({ status: 'new' }),
      this.quoteModel.aggregate<{ _id: string; count: number }>([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      this.contactModel.countDocuments(),
      this.contactModel.countDocuments({ isRead: false }),
      this.quoteModel.aggregate<{ _id: string; count: number }>([
        { $match: { createdAt: { $gte: since } } },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
            },
            count: { $sum: 1 },
          },
        },
      ]),
      this.quoteModel.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    // Fill gaps so the chart has one point per day.
    const counted = new Map(trendRaw.map((row) => [row._id, row.count]));
    const quoteTrend: { date: string; count: number }[] = [];
    for (let i = 0; i < TREND_DAYS; i += 1) {
      const day = new Date(since);
      day.setDate(since.getDate() + i);
      const key = day.toISOString().slice(0, 10);
      quoteTrend.push({ date: key, count: counted.get(key) ?? 0 });
    }

    return {
      counts: {
        services,
        servicesPublished,
        projects,
        projectsPublished,
        albums,
        media,
        testimonials,
        testimonialsPending,
      },
      quotes: {
        total: quotesTotal,
        new: quotesNew,
        byStatus: quotesByStatus.map((row) => ({
          status: row._id,
          count: row.count,
        })),
      },
      messages: { total: messagesTotal, unread: messagesUnread },
      quoteTrend,
      recentQuotes: recentQuotes as QuoteRequest[],
    };
  }
}
