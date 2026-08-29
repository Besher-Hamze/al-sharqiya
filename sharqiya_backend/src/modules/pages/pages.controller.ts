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
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreatePageDto, UpdatePageDto } from './dto/page.dto';
import { PagesService } from './pages.service';

@ApiTags('pages')
@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: all static pages (paginated)' })
  findAllAdmin(@Query() query: PaginationQueryDto) {
    return this.pagesService.findAllAdmin(query);
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: page by id' })
  findByIdAdmin(@Param('id') id: string) {
    return this.pagesService.findByIdAdmin(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: create a static page' })
  create(@Body() dto: CreatePageDto) {
    return this.pagesService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: update a static page' })
  update(@Param('id') id: string, @Body() dto: UpdatePageDto) {
    return this.pagesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: delete a static page' })
  remove(@Param('id') id: string) {
    return this.pagesService.remove(id);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Public: published page by slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.pagesService.findPublishedBySlug(slug);
  }
}
