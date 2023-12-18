import { Redis } from 'ioredis'
import { EnvService } from '@/infra/env/env.service'
import { Injectable, OnModuleDestroy } from '@nestjs/common'

@Injectable()
export class RedisService extends Redis implements OnModuleDestroy {
  constructor(envService: EnvService) {
    super({
      db: envService.get('REDIS_DB'),
      host: envService.get('REDIS_HOST'),
      port: envService.get('REDIS_PORT'),
    })
  }

  onModuleDestroy() {
    return this.disconnect()
  }
}
