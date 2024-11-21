import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StudentDiscipline } from './student-discipline.model';

@Module({
  imports: [SequelizeModule.forFeature([StudentDiscipline])],
})
export class StudentDisciplineModule {}
