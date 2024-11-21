import { Module } from '@nestjs/common';
import { DisciplineService } from './discipline.service';
import { DisciplineController } from './discipline.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Discipline } from './discipline.model';

@Module({
  imports: [SequelizeModule.forFeature([Discipline])],
  controllers: [DisciplineController],
  providers: [DisciplineService],
  exports: [DisciplineService],
})
export class DisciplineModule {}
