import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ContentService } from './content.service';
import { UpdateContentDto } from './dto/update-content.dto';

@ApiTags('content')
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get()
  @ApiOperation({ summary: 'Public: every content document keyed by name' })
  findAll() {
    return this.contentService.findAll();
  }

  @Get(':key')
  @ApiOperation({ summary: 'Public: one content document (homepage | about)' })
  findByKey(@Param('key') key: string) {
    return this.contentService.findByKey(key);
  }

  @Put(':key')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: replace a content document' })
  upsert(@Param('key') key: string, @Body() dto: UpdateContentDto) {
    return this.contentService.upsert(key, dto.data);
  }
}
