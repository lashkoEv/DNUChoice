import {
  AllowNull,
  AutoIncrement,
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
import { User } from '../user/user.model';
import { Discipline } from '../discipline/discipline.model';

@Table({
  tableName: 'studentDisciplines',
  timestamps: true,
})
export class StudentDiscipline extends Model {
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

  @ForeignKey(() => User)
  @Column
  studentId: number;

  @ForeignKey(() => Discipline)
  @Column
  disciplineId: number;

  @ApiProperty({
    description: 'For semester',
    nullable: false,
    example: '1',
    type: 'integer',
  })
  @Column({
    type: DataType.TINYINT,
    allowNull: false,
  })
  forSemester: number;

  @ApiProperty({
    description: 'For year',
    nullable: false,
    example: '1',
    type: 'integer',
  })
  @Column({
    type: DataType.TINYINT,
    allowNull: false,
  })
  forYear: number;

  @ApiProperty({
    description: 'Is locked to delete',
    nullable: false,
    example: 'false',
    type: 'boolean',
  })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  isLocked: boolean;

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
