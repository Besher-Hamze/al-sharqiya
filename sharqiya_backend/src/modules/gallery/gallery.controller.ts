import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { PublishDto } from '../../common/dto/publish.dto';
import { ReorderDto } from '../../common/dto/reorder.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateAlbumDto, UpdateAlbumDto } from './dto/album.dto';
import { GalleryService } from './gallery.service';

@ApiTags('gallery')
@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Get()
  @ApiOperation({ summary: 'Public: published gallery albums' })
  findPublished() {
    return this.galleryService.findPublished();
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: all albums (paginated)' })
  findAllAdmin(@Query() query: PaginationQueryDto) {
    return this.galleryService.findAllAdmin(query);
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: album by id' })
  findByIdAdmin(@Param('id') id: string) {
    return this.galleryService.findByIdAdmin(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: create an album' })
  create(@Body() dto: CreateAlbumDto) {
    return this.galleryService.create(dto);
  }

  @Patch('reorder')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: bulk order update' })
  reorder(@Body() dto: ReorderDto) {
    return this.galleryService.reorder(dto);
  }

  @Patch(':id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: toggle published state' })
  setPublished(@Param('id') id: string, @Body() dto: PublishDto) {
    return this.galleryService.setPublished(id, dto.isPublished);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: update an album' })
  update(@Param('id') id: string, @Body() dto: UpdateAlbumDto) {
    return this.galleryService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: delete an album' })
  remove(@Param('id') id: string) {
    return this.galleryService.remove(id);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Public: published album by slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.galleryService.findPublishedBySlug(slug);
  }
}
