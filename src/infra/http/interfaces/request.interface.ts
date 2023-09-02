import { Request } from 'express'
import { AuthUserPayload } from '@/infra/auth/jwt.strategy'

export interface IRequest extends Request {
  user?: AuthUserPayload
}
