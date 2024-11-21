import { ApiProperty } from '@nestjs/swagger';
import { DisciplineDto } from './DisciplineDto';
import { Discipline } from '../discipline.model';

export class DisciplinesDto {
  @ApiProperty({
    description: 'Values count',
    nullable: false,
    example: '5',
    type: 'integer',
  })
  count: number;

  @ApiProperty({
    type: [DisciplineDto],
  })
  data: DisciplineDto[];

  constructor(count: number, data: Discipline[]) {
    this.count = count;

    this.data = data.map((discipline) => new DisciplineDto(discipline));
  }
}
