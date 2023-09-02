import { GetRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/get-recent-questions'
import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { QuestionPresenter } from '../../presenters/question.presenter'
import { GetRecentQuestionsParamsDTO } from './get-recent-questions-params.dto'

@Controller('/questions')
export class GetRecentQuestionsController {
  constructor(private getRecentQuestions: GetRecentQuestionsUseCase) {}

  @Get()
  async handle(@Query() { page = 1 }: GetRecentQuestionsParamsDTO) {
    const result = await this.getRecentQuestions.execute({ page })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { questions } = result.value

    return {
      questions: questions.map((question) => QuestionPresenter.present(question)),
    }
  }
}
