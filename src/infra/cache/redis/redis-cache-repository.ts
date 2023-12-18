import { Injectable } from '@nestjs/common'
import { CacheRepository } from '../cache-repository'
import { RedisService } from './redis.service'

@Injectable()
export class RedisCacheRepository implements CacheRepository {
  // eslint-disable-next-line no-magic-numbers
  private readonly EXPIRATION_TIME_IN_SECONDS = 60 * 15 // 15 minutes

  constructor(private redis: RedisService) {}

  async set(key: string, value: string): Promise<void> {
    await this.redis.set(key, value, 'EX', this.EXPIRATION_TIME_IN_SECONDS)
  }

  get(key: string): Promise<string | null> {
    return this.redis.get(key)
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key)
  }
}
