import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question'
import { AuthUser } from '@/infra/auth/auth-user.decorator'
import { BadRequestException, Controller, Delete, HttpCode, HttpStatus, Param } from '@nestjs/common'

@Controller('/questions/:questionId')
export class DeleteQuestionController {
  constructor(private deleteQuestion: DeleteQuestionUseCase) {}

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(@AuthUser('sub') authorId: string, @Param('questionId') questionId: string) {
    const result = await this.deleteQuestion.execute({
      authorId,
      questionId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
