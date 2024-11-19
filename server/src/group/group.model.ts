import {
  AllowNull,
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Scopes,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user/user.model';

@Scopes(() => ({
  byId: (id: number) => ({
    where: { id },
  }),
  byPage: (limit: number = null, offset: number = 0) => ({
    limit,
    offset,
  }),
  withUsers: () => ({
    include: [
      {
        model: User,
        subQuery: false,
      },
    ],
  }),
}))
@Table({
  tableName: 'academicGroups',
  timestamps: true,
})
export class Group extends Model {
  @ApiProperty({
    description: 'Group identifier',
    nullable: false,
    example: 1,
    type: 'integer',
  })
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ApiProperty({
    description: 'Title',
    nullable: false,
    example: 'PZ-23m-2',
    type: 'string',
  })
  @AllowNull(false)
  @Column(DataType.STRING(255))
  title: string;

  @ApiProperty({
    description: 'Year',
    nullable: false,
    example: '1',
    type: 'integer',
  })
  @AllowNull(false)
  @Column(DataType.TINYINT)
  year: number;

  @HasMany(() => User)
  users: User[];

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
}
