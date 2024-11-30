import { PaginationSchema } from '../../resources/dto/PaginationSchema';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

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
}
