import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { BaseContentService } from '../../common/services/base-content.service';
import { Project, ProjectDocument } from './schemas/project.schema';

@Injectable()
export class ProjectsService extends BaseContentService<Project> {
  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>,
  ) {
    super(projectModel, 'Project', [
      'slug',
      'title.en',
      'title.ar',
      'client.en',
      'location.en',
    ]);
  }

  /** Public portfolio listing, optionally narrowed to one service line. */
  async findPublishedByService(serviceSlug?: string): Promise<Project[]> {
    const filter: FilterQuery<ProjectDocument> = { isPublished: true };
    if (serviceSlug) filter.serviceSlug = serviceSlug;
    return this.projectModel
      .find(filter)
      .sort({ isFeatured: -1, order: 1 })
      .lean();
  }

  async findFeatured(limit = 6): Promise<Project[]> {
    return this.projectModel
      .find({ isPublished: true, isFeatured: true })
      .sort({ order: 1 })
      .limit(limit)
      .lean();
  }

  /** Previous/next neighbours for the project detail pager. */
  async findNeighbours(
    slug: string,
  ): Promise<{ prev: Project | null; next: Project | null }> {
    const ordered = await this.projectModel
      .find({ isPublished: true })
      .select('slug title coverImage order')
      .sort({ order: 1 })
      .lean();
    const index = ordered.findIndex((item) => item.slug === slug);
    if (index === -1) return { prev: null, next: null };
    return {
      prev: (ordered[index - 1] as Project) ?? null,
      next: (ordered[index + 1] as Project) ?? null,
    };
  }
}
