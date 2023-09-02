import { ExtractJwt, Strategy } from 'passport-jwt'
import { z } from 'zod'
import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { EnvService } from '../env/env.service'

const tokenPayloadSchema = z.object({
  sub: z.string().uuid(),
})

type TokenPayload = z.infer<typeof tokenPayloadSchema>

export type AuthUserPayload = TokenPayload

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: EnvService) {
    const publicKey = config.get('JWT_PUBLIC_KEY')

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
