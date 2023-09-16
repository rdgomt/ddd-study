import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'
import { AuthUser } from '@/infra/auth/auth-user.decorator'
import { BadRequestException, Body, Controller, Param, Post } from '@nestjs/common'
import { AnswerQuestionDTO } from './answer-question.dto'

@Controller('/questions/:questionId/answers')
export class AnswerQuestionController {
  constructor(private answerQuestion: AnswerQuestionUseCase) {}

  @Post()
  async handle(
    @AuthUser('sub') authorId: string,
    @Param('questionId') questionId: string,
    @Body() body: AnswerQuestionDTO,
  ) {
    const { content } = body

    const result = await this.answerQuestion.execute({
      attachmentsIds: [],
      authorId,
      content,
      questionId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
