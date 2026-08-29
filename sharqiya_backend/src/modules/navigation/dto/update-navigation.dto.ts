import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { LocalizedStringDto } from '../../../common/dto/localized-string.dto';

export class NavItemDto {
  @ApiProperty({ example: 'services' })
  @IsString()
  key: string;

  @ApiProperty({ type: LocalizedStringDto })
  @ValidateNested()
  @Type(() => LocalizedStringDto)
  label: LocalizedStringDto;

  @ApiPropertyOptional({ example: '/services' })
  @IsOptional()
  @IsString()
  href?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  hidden?: boolean;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  order?: number;
}

export class UpdateNavigationDto {
  @ApiPropertyOptional({ type: [NavItemDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NavItemDto)
  headerMenu?: NavItemDto[];

  @ApiPropertyOptional({ type: [NavItemDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NavItemDto)
  footerMenu?: NavItemDto[];

  @ApiPropertyOptional({ type: [NavItemDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NavItemDto)
  legalMenu?: NavItemDto[];
}
