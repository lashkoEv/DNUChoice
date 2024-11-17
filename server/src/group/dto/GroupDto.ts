import { ApiProperty } from '@nestjs/swagger';
import { Group } from '../group.model';

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

  constructor(group: Group) {
    this.id = group.id;
    this.title = group.title;
    this.createdAt = group.createdAt;
    this.updatedAt = group.updatedAt;
  }
}
