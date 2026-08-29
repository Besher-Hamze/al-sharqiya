import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { Roles } from '../../common/decorators/roles.decorator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UpdateMediaDto, UploadMediaDto } from './dto/media.dto';
import { MediaService } from './media.service';

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15 MB

@ApiTags('media')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('superadmin', 'admin', 'editor')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: MAX_FILE_SIZE },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        altEn: { type: 'string' },
        altAr: { type: 'string' },
      },
      required: ['file'],
    },
  })
  @ApiOperation({
    summary:
      'Admin: upload a file (max 15 MB; images become webp + 400px thumbnail)',
  })
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadMediaDto,
  ) {
    return this.mediaService.upload(file, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Admin: list media (paginated, newest first)' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.mediaService.findAll(query);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Admin: update media alt text' })
  update(@Param('id') id: string, @Body() dto: UpdateMediaDto) {
    return this.mediaService.update(id, dto);
  }

  @Delete(':id')
  @Roles('superadmin', 'admin')
  @ApiOperation({ summary: 'Admin: delete media (also removes files on disk)' })
  remove(@Param('id') id: string) {
    return this.mediaService.remove(id);
  }
}
