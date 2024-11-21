import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly cacheService: RedisCacheService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: process.env.SECRET.toString(),
    });
  }

  async validate(payload: any) {
    const data = {
      token: await this.cacheService.get(`token_${payload.id}`),
    };

    if (!data.token) {
      throw new UnauthorizedException();
    }

    Object.assign(data, payload);

    return data;
  }
}
