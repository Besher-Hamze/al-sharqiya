import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class LocalizedStringDto {
  @ApiProperty({ example: 'Epoxy Flooring' })
  @IsString()
  en: string;

  @ApiProperty({ example: 'أرضيات الإيبوكسي' })
  @IsOptional()
  @IsString()
  ar: string;
}
