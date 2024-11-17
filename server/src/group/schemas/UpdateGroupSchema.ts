import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateGroupSchema {
  @ApiProperty({
    description: 'Title',
    nullable: false,
    example: 'PZ-23m-2',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  title: string;

  @ApiProperty({
    description: 'Year',
    nullable: false,
    example: '1',
    type: 'integer',
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  year: number;
}
