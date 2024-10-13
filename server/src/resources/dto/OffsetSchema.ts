import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Min, IsInt } from 'class-validator';

export class OffsetSchema {
  @ApiProperty({
    description: 'Offset',
    nullable: false,
    example: 0,
    type: 'number',
  })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset: number;
}
