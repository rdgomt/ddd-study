import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { envSchema } from './env/env.config'
import { EnvModule } from './env/env.module'
import { EventsModule } from './events/events.module'
import { HttpModule } from './http/http.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env) => envSchema.parse(env),
    }),
    AuthModule,
    EnvModule,
    HttpModule,
    EventsModule,
  ],
})
export class AppModule {}
