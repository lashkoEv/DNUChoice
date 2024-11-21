import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../user/dto/UserDto';
import { User } from '../../user/user.model';
import { IDiscipline } from '../entities/IDiscipline';

export class DisciplineDto {
  @ApiProperty({
    description: 'Discipline identifier',
    nullable: false,
    example: 1,
    type: 'integer',
  })
  id: number;

  @ApiProperty({
    description: 'Code',
    nullable: false,
    example: '1-01-1',
    type: 'string',
  })
  code: string;

  @ApiProperty({
    description: 'Title',
    nullable: false,
    example: 'Discipline title',
    type: 'string',
  })
  title: string;

  @ApiProperty({
    description: 'Semester',
    nullable: true,
    example: '1',
    type: 'integer',
  })
  semester: number;

  @ApiProperty({
    description: 'Year',
    nullable: true,
    example: '1',
    type: 'integer',
  })
  year: number;

  @ApiProperty({
    description: 'For semester',
    nullable: true,
    example: '1',
    type: 'integer',
  })
  forSemester?: number;

  @ApiProperty({
    description: 'For year',
    nullable: true,
    example: '1',
    type: 'integer',
  })
  forYear?: number;

  @ApiProperty({
    description: 'Catalogue type',
    nullable: false,
    example: '1',
    type: 'integer',
  })
  catalogueType: number;

  @ApiProperty({
    description: 'Educational level',
    nullable: false,
    example: '1',
    type: 'integer',
  })
  educationalLevel: number;

  @ApiProperty({
    description: 'Link to document',
    nullable: true,
    example:
      'https://www.dnu.dp.ua/docs/osvitni_programy/2025/FPM/3-ф05-01_Metody.pdf',
    type: 'string',
  })
  link: string;

  @ApiProperty({
    description: 'Created at',
    nullable: false,
    example: '2024-07-03T19:32:40.000Z',
    type: 'timestamp',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Updated at',
    nullable: false,
    example: '2024-07-03T19:32:40.000Z',
    type: 'timestamp',
  })
  updatedAt: Date;

  @ApiProperty({
    type: [UserDto],
    description: 'List of students',
  })
  users: UserDto[];

  constructor(discipline: IDiscipline) {
    this.id = discipline.id;
    this.code = discipline.code;
    this.title = discipline.title;
    this.semester = discipline.semester;
    this.year = discipline.year;
    this.forSemester = discipline.StudentDiscipline?.forSemester || undefined;
    this.forYear = discipline.StudentDiscipline?.forYear || undefined;
    this.catalogueType = discipline.catalogueType;
    this.educationalLevel = discipline.educationalLevel;
    this.link = discipline.link;
    this.createdAt = discipline.createdAt;
    this.updatedAt = discipline.updatedAt;
    this.users = discipline.users?.map((user: User) => new UserDto(user)) || [];
  }
}
