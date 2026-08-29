import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@alsharqiya.ae' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Sharqiya#2026' })
  @IsString()
  @MinLength(1)
  password: string;
}
