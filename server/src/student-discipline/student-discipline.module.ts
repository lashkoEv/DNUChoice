import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StudentDiscipline } from './student-discipline.model';
import { StudentDisciplineController } from './student-discipline.controller';
import { StudentDisciplineService } from './student-discipline.service';

@Module({
  imports: [SequelizeModule.forFeature([StudentDiscipline])],
  controllers: [StudentDisciplineController],
  providers: [StudentDisciplineService],
  exports: [StudentDisciplineService],
})
export class StudentDisciplineModule {}
