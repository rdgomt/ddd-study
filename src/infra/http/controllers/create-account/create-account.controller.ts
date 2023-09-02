import { StudentAlreadyExistsError } from '@/domain/account/application/errors/student-already-exists-error'
import { RegisterStudentUseCase } from '@/domain/account/application/use-cases/register-student'
import { PublicRoute } from '@/infra/auth/public-route.decorator'
import { BadRequestException, Body, ConflictException, Controller, Post } from '@nestjs/common'
import { CreateAccountDTO } from './create-account.dto'

@Controller('/accounts')
export class CreateAccountController {
  constructor(private registerStudent: RegisterStudentUseCase) {}

  @Post()
  @PublicRoute()
  async handle(@Body() body: CreateAccountDTO) {
    const result = await this.registerStudent.execute(body)

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case StudentAlreadyExistsError: {
          throw new ConflictException(error.message)
        }

        default: {
          throw new BadRequestException(error.message)
        }
      }
    }
  }
}
