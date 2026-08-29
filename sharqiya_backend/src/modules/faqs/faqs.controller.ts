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
import { CreateFaqDto, UpdateFaqDto } from './dto/faq.dto';
import { FaqsService } from './faqs.service';

@ApiTags('faqs')
@Controller('faqs')
export class FaqsController {
  constructor(private readonly faqsService: FaqsService) {}

  @Get()
  @ApiOperation({ summary: 'Public: published FAQs in display order' })
  findPublished() {
    return this.faqsService.findPublished();
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: all FAQs (paginated)' })
  findAllAdmin(@Query() query: PaginationQueryDto) {
    return this.faqsService.findAllAdmin(query);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: create an FAQ' })
  create(@Body() dto: CreateFaqDto) {
    return this.faqsService.create(dto);
  }

  @Patch('reorder')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: bulk order update' })
  reorder(@Body() dto: ReorderDto) {
    return this.faqsService.reorder(dto);
  }

  @Patch(':id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: toggle published state' })
  setPublished(@Param('id') id: string, @Body() dto: PublishDto) {
    return this.faqsService.setPublished(id, dto.isPublished);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: update an FAQ' })
  update(@Param('id') id: string, @Body() dto: UpdateFaqDto) {
    return this.faqsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: delete an FAQ' })
  remove(@Param('id') id: string) {
    return this.faqsService.remove(id);
  }
}
