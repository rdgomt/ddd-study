import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-question-best-answer'
import { AuthUser } from '@/infra/auth/auth-user.decorator'
import { BadRequestException, Controller, HttpCode, HttpStatus, Param, Patch } from '@nestjs/common'

@Controller('/answers/:answerId/choose-as-best')
export class ChooseQuestionBestAnswerController {
  constructor(private chooseQuestionBestAnswer: ChooseQuestionBestAnswerUseCase) {}

  @Patch()
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(@AuthUser('sub') authorId: string, @Param('answerId') answerId: string) {
    const result = await this.chooseQuestionBestAnswer.execute({
      answerId,
      authorId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
