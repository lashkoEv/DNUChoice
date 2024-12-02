import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model';
import { IsUnique } from 'src/custom-validators/IsUnique';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';
import { GroupModule } from '../group/group.module';
import { DisciplineModule } from '../discipline/discipline.module';
import { StudentDisciplineModule } from '../student-discipline/student-discipline.module';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    RedisCacheModule,
    GroupModule,
    DisciplineModule,
    StudentDisciplineModule,
  ],
  controllers: [UserController],
  providers: [UserService, IsUnique],
  exports: [UserService],
})
export class UserModule {}
