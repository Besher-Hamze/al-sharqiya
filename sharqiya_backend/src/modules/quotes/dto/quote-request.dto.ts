import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  PROPERTY_TYPES,
  PropertyType,
  QUOTE_STATUSES,
  QuoteStatus,
} from '../schemas/quote-request.schema';

export class CreateQuoteRequestDto {
  @ApiProperty({ example: 'Ahmed Al Mansoori' })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name: string;

  @ApiProperty({ example: '+971 50 555 2521' })
  @IsString()
  @MinLength(6)
  @MaxLength(40)
  phone: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(160)
  company?: string;

  @ApiPropertyOptional({ example: ['epoxy-flooring', 'painting'] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  services?: string[];

  @ApiPropertyOptional({ enum: PROPERTY_TYPES })
  @IsOptional()
  @IsIn(PROPERTY_TYPES)
  propertyType?: PropertyType;

  @ApiPropertyOptional({ example: 'Dubai' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  emirate?: string;

  @ApiPropertyOptional({ example: '1,200 m²' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  area?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(3000)
  message?: string;

  @ApiPropertyOptional({ example: 'en' })
  @IsOptional()
  @IsIn(['en', 'ar'])
  locale?: string;
}

export class UpdateQuoteRequestDto {
  @ApiPropertyOptional({ enum: QUOTE_STATUSES })
  @IsOptional()
  @IsIn(QUOTE_STATUSES)
  status?: QuoteStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  adminNote?: string;
}
