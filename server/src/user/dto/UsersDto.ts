import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './UserDto';
import { User } from 'src/user/user.model';
import { IUser } from '../entities/IUser';

export class UsersDto {
  @ApiProperty({
    description: 'Values count',
    nullable: false,
    example: '5',
    type: 'integer',
  })
  count: number;

  @ApiProperty({
    type: [UserDto],
  })
  data: UserDto[];

  constructor(count: number, data: User[]) {
    this.count = count;

    this.data = data.map((user) => new UserDto(user as IUser));
  }
}
