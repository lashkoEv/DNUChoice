import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

export class NumberIdSchema {
  @ApiProperty({
    description: 'Identifier',
    nullable: false,
    example: 1,
    type: 'number',
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  id: number;
}
