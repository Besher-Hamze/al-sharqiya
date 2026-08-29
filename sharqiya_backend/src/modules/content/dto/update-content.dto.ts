import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';

export class UpdateContentDto {
  @ApiProperty({
    description: 'Complete replacement payload for this content key',
    type: Object,
  })
  @IsObject()
  data: Record<string, unknown>;
}
