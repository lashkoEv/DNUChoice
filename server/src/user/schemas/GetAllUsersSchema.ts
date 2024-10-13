import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Min, IsInt, IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class GetAllUsersSchema {
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
}
