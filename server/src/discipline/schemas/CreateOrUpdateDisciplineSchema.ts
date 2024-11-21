import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsUrl,
  MaxLength,
  Min,
  Max,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrUpdateDisciplineSchema {
  @ApiProperty({
    description: 'Code of the discipline',
    example: '1-01-1',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  code: string;

  @ApiProperty({
    description: 'Title of the discipline',
    example: 'Discipline title',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    description: 'Semester in which the discipline is offered',
    example: 1,
    type: 'integer',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  semester?: number;

  @ApiProperty({
    description: 'Year',
    example: 1,
    type: 'integer',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  year?: number;

  @ApiProperty({
    description: 'Catalogue type of the discipline',
    example: 1,
    type: 'integer',
  })
  @IsInt()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(2)
  catalogueType: number;

  @ApiProperty({
    description: 'Educational level of the discipline',
    example: 1,
    type: 'integer',
  })
  @IsInt()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  educationalLevel: number;

  @ApiProperty({
    description: 'Link to the discipline resources',
    example:
      'https://www.dnu.dp.ua/docs/osvitni_programy/2025/FPM/3-ф05-01_Metody.pdf',
    type: 'string',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  link?: string;
}
