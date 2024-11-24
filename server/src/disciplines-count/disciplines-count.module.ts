import { Module } from '@nestjs/common';
import { DisciplinesCountService } from './disciplines-count.service';
import { DisciplinesCountController } from './disciplines-count.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { DisciplinesCount } from './disciplines-count.model';

@Module({
  imports: [SequelizeModule.forFeature([DisciplinesCount])],
  controllers: [DisciplinesCountController],
  providers: [DisciplinesCountService],
  exports: [DisciplinesCountService],
})
export class DisciplinesCountModule {}
