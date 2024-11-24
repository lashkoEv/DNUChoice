import { ApiProperty } from '@nestjs/swagger';
import { DisciplinesCount } from '../disciplines-count.model';

export class DisciplinesCountDto {
  @ApiProperty({
    nullable: false,
    example: 1,
    type: 'integer',
  })
  id: number;

  @ApiProperty({
    nullable: false,
    example: '1',
    type: 'integer',
  })
  groupId: number;

  @ApiProperty({
    nullable: false,
    example: '1',
    type: 'integer',
  })
  disciplinesCount: number;

  @ApiProperty({
    nullable: false,
    example: '1',
    type: 'integer',
  })
  toSemester: number;

  @ApiProperty({
    nullable: false,
    example: '1',
    type: 'integer',
  })
  toYear: number;

  @ApiProperty({
    nullable: false,
    example: '2024-07-03T19:32:40.000Z',
    type: 'timestamp',
  })
  createdAt: Date;

  @ApiProperty({
    nullable: false,
    example: '2024-07-03T19:32:40.000Z',
    type: 'timestamp',
  })
  updatedAt: Date;

  constructor(disciplinesCount: DisciplinesCount) {
    this.id = disciplinesCount.id;
    this.groupId = disciplinesCount.groupId;
    this.disciplinesCount = disciplinesCount.disciplinesCount;
    this.toSemester = disciplinesCount.toSemester;
    this.toYear = disciplinesCount.toYear;
    this.createdAt = disciplinesCount.createdAt;
    this.updatedAt = disciplinesCount.updatedAt;
  }
}
