import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user/user.model';
import { RedisCacheModule } from './redis-cache/redis-cache.module';
import { SessionModule } from './session/session.module';
import { GroupModule } from './group/group.module';
import { Group } from './group/group.model';
import { DisciplineModule } from './discipline/discipline.module';
import { Discipline } from './discipline/discipline.model';
import { StudentDiscipline } from './student-discipline/student-discipline.model';
import { StudentDisciplineModule } from './student-discipline/student-discipline.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.env.NODE_ENV || 'dev'}.env`,
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      models: [User, Group, Discipline, StudentDiscipline],
    }),
    UserModule,
    RedisCacheModule,
    SessionModule,
    GroupModule,
    DisciplineModule,
    StudentDisciplineModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
