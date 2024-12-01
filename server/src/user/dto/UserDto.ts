import { ApiProperty } from '@nestjs/swagger';
import { IUser } from '../entities/IUser';
import { SessionDto } from 'src/session/dto/SessionDto';
import { GroupDto } from '../../group/dto/GroupDto';
import { DisciplineDto } from '../../discipline/dto/DisciplineDto';

export class UserDto {
  @ApiProperty({
    description: 'Auth token',
    nullable: false,
    example: '65bm8u56uby95m8uy95mu9d4x98xm48f594bn45mtu54m5',
    type: 'string',
  })
  session: SessionDto;

  @ApiProperty({
    description: 'User identifier',
    nullable: false,
    example: 1,
    type: 'integer',
  })
  id: number;

  @ApiProperty({
    description: 'Full name',
    nullable: false,
    example: 'John Doe',
    type: 'string',
  })
  name: string;

  @ApiProperty({
    description: 'Email',
    nullable: false,
    example: 'example@example.com',
    type: 'string',
  })
  email: string;

  @ApiProperty({
    description: 'Role',
    nullable: false,
    example: 3,
    type: 'number',
  })
  role: number;

  @ApiProperty({
    description: 'Group ID',
    nullable: true,
    example: 1,
    type: 'number',
  })
  groupId: number;

  @ApiProperty({
    type: GroupDto,
  })
  group: GroupDto;

  @ApiProperty({
    type: [DisciplineDto],
  })
  disciplines: DisciplineDto[];

  @ApiProperty({
    description: 'Student discipline identifier',
    nullable: true,
    example: '1',
    type: 'number',
  })
  studentDisciplineId?: number;

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
    description: 'Is locked',
    nullable: true,
    example: 'false',
    type: 'boolean',
  })
  isLocked?: boolean;

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

  constructor({
    id,
    name,
    email,
    role,
    groupId,
    group,
    createdAt,
    updatedAt,
    token,
    disciplines,
    StudentDiscipline,
  }: IUser) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
    groupId && (this.groupId = groupId);
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.session = token ? new SessionDto(token) : undefined;
    this.group = group ? new GroupDto(group) : undefined;
    this.disciplines = disciplines
      ? disciplines.map((item) => new DisciplineDto(item))
      : undefined;
    this.studentDisciplineId = StudentDiscipline?.id || undefined;
    this.forSemester = StudentDiscipline?.forSemester || undefined;
    this.forYear = StudentDiscipline?.forYear || undefined;
    this.isLocked = StudentDiscipline?.isLocked || undefined;
  }
}
