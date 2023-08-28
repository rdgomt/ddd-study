import type { Request } from 'express'
import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { CurrentUserPayload } from './jwt.strategy'

export const CurrentUser = createParamDecorator(
  (data: keyof CurrentUserPayload | undefined, context: ExecutionContext) => {
    const request: Request = context.switchToHttp().getRequest()
    const user = request.user as CurrentUserPayload | undefined

    return data ? user?.[data] : user
  },
)
