import { ApiProperty } from '@nestjs/swagger';
import { Group } from '../group.model';
import { GroupDto } from './GroupDto';

export class GroupsDto {
  @ApiProperty({
    description: 'Values count',
    nullable: false,
    example: '5',
    type: 'integer',
  })
  count: number;

  @ApiProperty({
    type: [GroupDto],
  })
  data: GroupDto[];

  constructor(count: number, data: Group[]) {
    this.count = count;

    this.data = data.map((group) => new GroupDto(group));
  }
}
