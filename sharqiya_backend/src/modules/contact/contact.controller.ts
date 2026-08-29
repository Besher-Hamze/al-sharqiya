import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Roles } from '../../common/decorators/roles.decorator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ContactService } from './contact.service';
import {
  CreateContactMessageDto,
  UpdateContactMessageDto,
} from './dto/contact.dto';

@ApiTags('contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @HttpCode(201)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @ApiOperation({ summary: 'Public: send a contact message' })
  create(@Body() dto: CreateContactMessageDto) {
    return this.contactService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: inbox (paginated, newest first)' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.contactService.findAll(query);
  }

  @Get('unread-count')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: unread message count' })
  countUnread() {
    return this.contactService.countUnread();
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: mark read / unread' })
  update(@Param('id') id: string, @Body() dto: UpdateContactMessageDto) {
    return this.contactService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: delete a message' })
  remove(@Param('id') id: string) {
    return this.contactService.remove(id);
  }
}
