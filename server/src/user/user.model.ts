import { ApiProperty } from '@nestjs/swagger';
import { Op } from 'sequelize';
import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Scopes,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';
import { Group } from '../group/group.model';
import { Discipline } from '../discipline/discipline.model';
import { StudentDiscipline } from '../student-discipline/student-discipline.model';

@Scopes(() => ({
  byId: (id: number) => ({
    where: { id },
  }),
  byPage: (limit: number = null, offset: number = 0) => ({
    limit,
    offset,
  }),
  excludesId: (id: number) => ({
    where: { id: { [Op.ne]: id } },
  }),
  byNameOrEmail: (value: string) => ({
    where: {
      [Op.or]: {
        name: {
          [Op.like]: `%${value}%`,
        },
        email: {
          [Op.like]: `%${value}%`,
        },
      },
    },
  }),
  byRole: (role: number) => ({
    where: { role },
  }),
  withGroup: () => ({
    include: [
      {
        model: Group,
        subQuery: false,
      },
    ],
    subQuery: false,
  }),
  withDisciplines: () => ({
    include: [
      {
        model: Discipline,
        through: { attributes: ['forSemester', 'forYear'] },
      },
    ],
    subQuery: false,
  }),
}))
@Table({
  tableName: 'users',
  timestamps: true,
})
export class User extends Model {
  @ApiProperty({
    description: 'User identifier',
    nullable: false,
    example: 1,
    type: 'integer',
  })
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ApiProperty({
    description: 'Full name',
    nullable: false,
    example: 'John Doe',
    type: 'string',
  })
  @AllowNull(false)
  @Column(DataType.STRING(500))
  name: string;

  @ApiProperty({
    description: 'Email',
    nullable: false,
    example: 'example@example.com',
    type: 'string',
  })
  @Unique
  @AllowNull(false)
  @Column({
    type: DataType.STRING(255),
    validate: {
      isEmail: true,
    },
  })
  email: string;

  @ApiProperty({
    description: 'Password',
    nullable: false,
    example: 'password',
    type: 'string',
  })
  @AllowNull(false)
  @Column(DataType.STRING(255))
  password: string;

  @ApiProperty({
    description: 'Role',
    nullable: false,
    example: 1,
    type: 'integer',
  })
  @AllowNull(false)
  @Column(DataType.TINYINT)
  role: number;

  @ApiProperty({
    description: 'Group identifier',
    nullable: true,
    example: 1,
    type: 'integer',
  })
  @AllowNull(true)
  @Column(DataType.INTEGER)
  @ForeignKey(() => Group)
  groupId: number;

  @ApiProperty({
    description: 'Created at',
    nullable: false,
    example: '2024-07-03T19:32:40.000Z',
    type: 'timestamp',
  })
  @CreatedAt
  @AllowNull(false)
  @Column({ type: DataType.DATE })
  createdAt: Date;

  @ApiProperty({
    description: 'Updated at',
    nullable: false,
    example: '2024-07-03T19:32:40.000Z',
    type: 'timestamp',
  })
  @UpdatedAt
  @AllowNull(false)
  @Column({ type: DataType.DATE })
  updatedAt: Date;

  @BelongsTo(() => Group)
  group: Group;

  @BelongsToMany(() => Discipline, () => StudentDiscipline)
  disciplines: Discipline[];
}
