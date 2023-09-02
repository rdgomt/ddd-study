import type { Request } from 'express'
import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { AuthUserPayload } from './jwt.strategy'

export const AuthUser = createParamDecorator((data: keyof AuthUserPayload | undefined, context: ExecutionContext) => {
  const request: Request = context.switchToHttp().getRequest()
  const user = request.user as AuthUserPayload | undefined

  return data ? user?.[data] : user
})
