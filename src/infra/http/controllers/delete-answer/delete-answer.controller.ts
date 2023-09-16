import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer'
import { AuthUser } from '@/infra/auth/auth-user.decorator'
import { BadRequestException, Controller, Delete, HttpCode, HttpStatus, Param } from '@nestjs/common'

@Controller('/answers/:answerId')
export class DeleteAnswerController {
  constructor(private deleteAnswer: DeleteAnswerUseCase) {}

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(@AuthUser('sub') authorId: string, @Param('answerId') answerId: string) {
    const result = await this.deleteAnswer.execute({
      answerId,
      authorId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
