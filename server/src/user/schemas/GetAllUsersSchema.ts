import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsPositive,
  IsArray,
  ArrayMinSize,
} from 'class-validator';
import { PaginationSchema } from '../../resources/dto/PaginationSchema';
import { Transform } from 'class-transformer';

export class GetAllUsersSchema extends PaginationSchema {
  @ApiProperty({
    description: 'Search value',
    required: false,
    nullable: true,
    example: 'John',
    type: 'string',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  query?: string;

  @ApiProperty({
    description: 'Roles as an array of numbers',
    required: false,
    nullable: true,
    example: [1, 2],
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map(Number) : [Number(value)],
  )
  @IsInt({ each: true })
  @IsPositive({ each: true })
  role?: number[];
}
