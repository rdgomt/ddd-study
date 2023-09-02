import { WrongCredentialsError } from '@/domain/account/application/errors/wrong-credentials-error'
import { AuthenticateStudentUseCase } from '@/domain/account/application/use-cases/authenticate-student'
import { PublicRoute } from '@/infra/auth/public-route.decorator'
import { BadRequestException, Body, Controller, Post, UnauthorizedException } from '@nestjs/common'
import { AuthenticateDTO } from './authenticate.dto'

@Controller('/sessions')
export class AuthenticateController {
  constructor(private authenticateStudent: AuthenticateStudentUseCase) {}

  @Post()
  @PublicRoute()
  async handle(@Body() body: AuthenticateDTO) {
    const result = await this.authenticateStudent.execute(body)

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialsError: {
          throw new UnauthorizedException(error.message)
        }

        default: {
          throw new BadRequestException(error.message)
        }
      }
    }

    const { accessToken } = result.value

    return {
      accessToken,
    }
  }
}
