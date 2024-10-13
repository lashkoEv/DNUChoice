import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';

@Injectable()
export class SessionService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly cacheService: RedisCacheService,
  ) {}

  createToken(id: number): Promise<string> {
    return this.jwtService.signAsync(
      { id },
      {
        secret: process.env.SECRET.toString(),
        expiresIn: process.env.EXPIRES_IN.toString(),
      },
    );
  }

  async verify(token: any) {
    const payload = this.jwtService.verify(token, {
      secret: process.env.SECRET.toString(),
    });

    const redisToken = await this.cacheService.get(`token_${payload.id}`);

    if (!redisToken) {
      throw new WsException('Invalid token!');
    }

    return payload;
  }
}
