import { Module } from '@nestjs/common';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';
import { JwtStrategy } from 'src/strategies/jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET,
    }),
    UserModule,
    RedisCacheModule,
  ],
  controllers: [SessionController],
  providers: [SessionService, JwtStrategy],
  exports: [SessionService],
})
export class SessionModule {}
