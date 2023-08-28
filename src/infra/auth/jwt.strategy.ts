import { ExtractJwt, Strategy } from 'passport-jwt'
import { z } from 'zod'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Env } from '../env'

const tokenPayloadSchema = z.object({
  sub: z.string().uuid(),
})

type TokenPayload = z.infer<typeof tokenPayloadSchema>

export type CurrentUserPayload = TokenPayload

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService<Env, true>) {
    const publicKey = config.get('JWT_PUBLIC_KEY', { infer: true })

    super({
      algorithms: ['RS256'],
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Buffer.from(publicKey, 'base64'),
    })
  }

  async validate(payload: TokenPayload) {
    return tokenPayloadSchema.parse(payload)
  }
}
