import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import type { UserRole } from '../../../common/types/auth-user.interface';

export class CreateUserDto {
  @ApiProperty({ example: 'manager@alsharqiya.ae' })
  @IsEmail()
  email: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'Site Manager' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiPropertyOptional({ enum: ['superadmin', 'admin', 'editor'] })
  @IsOptional()
  @IsIn(['superadmin', 'admin', 'editor'])
  role?: UserRole;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({ minLength: 8, description: 'Omit to keep unchanged' })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;
}
