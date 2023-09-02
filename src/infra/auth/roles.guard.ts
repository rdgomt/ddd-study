/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable etc/no-commented-out-code */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

// TODO: feat: implement it
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    return true

    // const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
    //   context.getHandler(),
    //   context.getClass(),
    // ])

    // if (!requiredRoles) {
    //   return true
    // }

    // const { user } = context.switchToHttp().getRequest<IRequest>()

    // return requiredRoles.some((role) => user.roles?.includes(role))
  }
}
