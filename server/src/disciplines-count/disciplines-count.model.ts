import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Group } from '../group/group.model';

@Table({
  tableName: 'disciplinesCount',
  timestamps: true,
})
export class DisciplinesCount extends Model {
  @ApiProperty({
    description: 'Identifier',
    nullable: false,
    example: 1,
    type: 'integer',
  })
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ApiProperty({
    description: 'Disciplines count',
    nullable: false,
    example: 1,
    type: 'integer',
  })
  @AllowNull(false)
  @Column(DataType.INTEGER)
  disciplinesCount: number;

  @ApiProperty({
    description: 'To semester',
    nullable: false,
    example: 1,
    type: 'integer',
  })
  @AllowNull(false)
  @Column(DataType.TINYINT)
  toSemester: number;

  @ApiProperty({
    description: 'To year',
    nullable: false,
    example: 1,
    type: 'integer',
  })
  @AllowNull(false)
  @Column(DataType.TINYINT)
  toYear: number;

  @ApiProperty({
    description: 'Group identifier',
    nullable: false,
    example: 1,
    type: 'integer',
  })
  @AllowNull(false)
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
}
