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
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Roles } from '../../common/decorators/roles.decorator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import {
  CreateQuoteRequestDto,
  UpdateQuoteRequestDto,
} from './dto/quote-request.dto';
import { QuotesService } from './quotes.service';
import { QuoteStatus } from './schemas/quote-request.schema';

@ApiTags('quotes')
@Controller('quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Post()
  @HttpCode(201)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @ApiOperation({ summary: 'Public: submit a quote request' })
  create(@Body() dto: CreateQuoteRequestDto) {
    return this.quotesService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin', 'editor')
  @ApiBearerAuth()
  @ApiQuery({ name: 'status', required: false })
  @ApiOperation({ summary: 'Admin: quote requests (paginated, newest first)' })
  findAll(
    @Query() query: PaginationQueryDto,
    @Query('status') status?: QuoteStatus,
  ) {
    return this.quotesService.findAll(query, status);
  }

  @Get('new-count')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: number of unhandled requests' })
  countNew() {
    return this.quotesService.countNew();
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: update status / internal note' })
  update(@Param('id') id: string, @Body() dto: UpdateQuoteRequestDto) {
    return this.quotesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: delete a quote request' })
  remove(@Param('id') id: string) {
    return this.quotesService.remove(id);
  }
}
