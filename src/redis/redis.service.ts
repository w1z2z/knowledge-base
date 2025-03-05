import { Injectable, Inject, OnModuleInit, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  onModuleInit() {
    this.redis
      .on('connect', () => Logger.log('Redis connected', 'CACHE'))
      .on('error', (err) => Logger.log('Redis error:', err, 'CACHE'));
  }

  async set(key: string, value: any, ttl: number): Promise<void> {
    const strValue =
      typeof value === 'object' ? JSON.stringify(value) : String(value);
    await this.redis.setex(key, ttl, strValue);
  }

  async get<T = string>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);
    try {
      return JSON.parse(value!) as T;
    } catch {
      return value as T;
    }
  }

  async del(key: string): Promise<number> {
    return this.redis.del(key);
  }

  async has(key: string): Promise<boolean> {
    return (await this.redis.exists(key)) === 1;
  }

  async keys(pattern: string): Promise<string[]> {
    return this.redis.keys(pattern);
  }
}
