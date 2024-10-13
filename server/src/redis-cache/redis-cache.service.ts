import { Injectable } from '@nestjs/common';
import { Cache } from '@nestjs/cache-manager';

@Injectable()
export class RedisCacheService {
  constructor(private readonly cache: Cache) {}

  async get(key: string): Promise<any> {
    return this.cache.get(key) || 0;
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    return this.cache.set(key, value, ttl);
  }

  async remove(key: string): Promise<void> {
    return this.cache.del(key);
  }
}
