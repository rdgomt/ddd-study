import { PaginationParams } from '@/core/repositories/pagination-params'
import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'

interface GetQuestionAnswersUseCaseInput {
  pagination: PaginationParams
  questionId: string
}

interface GetQuestionAnswersUseCaseOutput {
  answers: Answer[]
}

export class GetQuestionAnswersUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({ questionId, pagination }: GetQuestionAnswersUseCaseInput): Promise<GetQuestionAnswersUseCaseOutput> {
    const answers = await this.answersRepository.findManyByQuestionId(questionId, { page: pagination.page })

    return {
      answers,
    }
  }
}
