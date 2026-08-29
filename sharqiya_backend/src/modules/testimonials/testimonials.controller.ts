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
import {
  CreateTestimonialDto,
  UpdateTestimonialDto,
} from './dto/testimonial.dto';
import { TestimonialsService } from './testimonials.service';

@ApiTags('testimonials')
@Controller('testimonials')
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @Get()
  @ApiOperation({ summary: 'Public: published testimonials' })
  findPublished() {
    return this.testimonialsService.findPublished();
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: all testimonials (paginated)' })
  findAllAdmin(@Query() query: PaginationQueryDto) {
    return this.testimonialsService.findAllAdmin(query);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: create a testimonial' })
  create(@Body() dto: CreateTestimonialDto) {
    return this.testimonialsService.create(dto);
  }

  @Patch('reorder')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: bulk order update' })
  reorder(@Body() dto: ReorderDto) {
    return this.testimonialsService.reorder(dto);
  }

  @Patch(':id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: approve / unapprove a testimonial' })
  setPublished(@Param('id') id: string, @Body() dto: PublishDto) {
    return this.testimonialsService.setPublished(id, dto.isPublished);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: update a testimonial' })
  update(@Param('id') id: string, @Body() dto: UpdateTestimonialDto) {
    return this.testimonialsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: delete a testimonial' })
  remove(@Param('id') id: string) {
    return this.testimonialsService.remove(id);
  }
}
