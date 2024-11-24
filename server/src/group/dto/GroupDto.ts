import { ApiProperty } from '@nestjs/swagger';
import { Group } from '../group.model';
import { UserDto } from '../../user/dto/UserDto';
import { User } from '../../user/user.model';
import { DisciplinesCountDto } from '../../disciplines-count/dto/DisciplinesCountDto';

export class GroupDto {
  @ApiProperty({
    description: 'Group identifier',
    nullable: false,
    example: 1,
    type: 'integer',
  })
  id: number;

  @ApiProperty({
    description: 'Title',
    nullable: false,
    example: 'PZ-23m-2',
    type: 'string',
  })
  title: string;

  @ApiProperty({
    description: 'Year',
    nullable: false,
    example: '1',
    type: 'integer',
  })
  year: number;

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
    description: 'List of users in the group',
  })
  users: UserDto[];

  @ApiProperty({
    type: [DisciplinesCountDto],
    description: 'List of disciplines counts',
  })
  disciplinesCounts: DisciplinesCountDto[];

  constructor(group: Group) {
    this.id = group.id;
    this.title = group.title;
    this.year = group.year;
    this.createdAt = group.createdAt;
    this.updatedAt = group.updatedAt;
    this.users = group.users?.map((user: User) => new UserDto(user)) || [];
    this.disciplinesCounts =
      group.disciplinesCount?.map((item) => new DisciplinesCountDto(item)) ||
      [];
  }
}
