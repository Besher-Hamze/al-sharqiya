import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuotesController } from './quotes.controller';
import { QuotesService } from './quotes.service';
import {
  QuoteRequest,
  QuoteRequestSchema,
} from './schemas/quote-request.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: QuoteRequest.name, schema: QuoteRequestSchema },
    ]),
  ],
  controllers: [QuotesController],
  providers: [QuotesService],
})
export class QuotesModule {}
