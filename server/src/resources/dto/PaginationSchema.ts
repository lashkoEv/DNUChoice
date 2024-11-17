import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Min, IsInt, IsOptional } from 'class-validator';

export class PaginationSchema {
  @ApiProperty({
    description: 'Limit',
    required: false,
    example: 10,
    type: 'number',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number;

  @ApiProperty({
    description: 'Offset',
    required: false,
    example: 0,
    type: 'number',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset: number;
}
