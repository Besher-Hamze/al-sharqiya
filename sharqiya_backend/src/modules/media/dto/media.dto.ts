import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UploadMediaDto {
  @ApiPropertyOptional({ description: 'English alt text' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  altEn?: string;

  @ApiPropertyOptional({ description: 'Arabic alt text' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  altAr?: string;
}

export class UpdateMediaDto {
  @ApiPropertyOptional({ description: 'English alt text' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  altEn?: string;

  @ApiPropertyOptional({ description: 'Arabic alt text' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  altAr?: string;
}
