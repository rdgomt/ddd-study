import { GetQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/get-question-answers'
import { BadRequestException, Controller, Get, Param, Query } from '@nestjs/common'
import { AnswerPresenter } from '../../presenters/answer.presenter'
import { GetQuestionAnswersQueryParams } from './get-question-answers-query-params'

@Controller('/questions/:questionId/answers')
export class GetQuestionAnswersController {
  constructor(private getQuestionAnswers: GetQuestionAnswersUseCase) {}

  @Get()
  async handle(@Param('questionId') questionId: string, @Query() { page = 1 }: GetQuestionAnswersQueryParams) {
    const result = await this.getQuestionAnswers.execute({
      pagination: {
        page,
      },
      questionId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { answers } = result.value

    return { answers: answers.map((answer) => AnswerPresenter.toHTTP(answer)) }
  }
}
