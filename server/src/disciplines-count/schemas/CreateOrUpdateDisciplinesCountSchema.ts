import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsPositive, Max, Min } from 'class-validator';

export class CreateOrUpdateDisciplinesCountSchema {
  @ApiProperty({
    example: '1',
    type: 'integer',
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  groupId: number;

  @ApiProperty({
    example: 1,
    type: 'integer',
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  disciplinesCount: number;

  @ApiProperty({
    example: 1,
    type: 'integer',
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(2)
  toSemester: number;

  @ApiProperty({
    example: 1,
    type: 'integer',
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  toYear: number;
}
