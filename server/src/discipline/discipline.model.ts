import {
  AllowNull,
  AutoIncrement,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  Model,
  PrimaryKey,
  Scopes,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user/user.model';
import { StudentDiscipline } from '../student-discipline/student-discipline.model';

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
        through: { attributes: ['forSemester', 'forYear'] },
      },
    ],
    subQuery: false,
  }),
}))
@Table({
  tableName: 'disciplines',
  timestamps: true,
})
export class Discipline extends Model {
  @ApiProperty({
    description: 'Discipline identifier',
    nullable: false,
    example: 1,
    type: 'integer',
  })
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ApiProperty({
    description: 'Code',
    nullable: false,
    example: '1-01-1',
    type: 'string',
  })
  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(100))
  code: string;

  @ApiProperty({
    description: 'title',
    nullable: false,
    example: 'Discipline title',
    type: 'string',
  })
  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(100))
  title: string;

  @ApiProperty({
    description: 'Semester',
    nullable: true,
    example: '1',
    type: 'integer',
  })
  @Column({
    type: DataType.TINYINT,
    allowNull: true,
  })
  semester: number;

  @ApiProperty({
    description: 'Year',
    nullable: true,
    example: '1',
    type: 'integer',
  })
  @Column({
    type: DataType.TINYINT,
    allowNull: true,
  })
  year: number;

  @ApiProperty({
    description: 'Catalogue type',
    nullable: false,
    example: '1',
    type: 'integer',
  })
  @Column({
    type: DataType.TINYINT,
    allowNull: false,
  })
  catalogueType: number;

  @ApiProperty({
    description: 'Educational level',
    nullable: false,
    example: '1',
    type: 'integer',
  })
  @Column({
    type: DataType.TINYINT,
    allowNull: false,
  })
  educationalLevel: number;

  @ApiProperty({
    description: 'Link',
    nullable: true,
    example:
      'https://www.dnu.dp.ua/docs/osvitni_programy/2025/FPM/3-ф05-01_Metody.pdf',
    type: 'string',
  })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  link: string;

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

  @BelongsToMany(() => User, () => StudentDiscipline)
  users: User[];
}
