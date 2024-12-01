import { PaginationSchema } from '../../resources/dto/PaginationSchema';
import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class GetDisciplinesSchema extends PaginationSchema {
  @ApiProperty({
    type: 'integer',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  semester?: string;

  @ApiProperty({
    type: 'integer',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  year?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map(Number) : [Number(value)],
  )
  @IsInt({ each: true })
  @IsPositive({ each: true })
  id?: number[];
}
