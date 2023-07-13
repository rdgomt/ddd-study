import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionComment } from '../../enterprise/entities/question-comment'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'

interface GetQuestionCommentsUseCaseInput {
  pagination: PaginationParams
  questionId: string
}

interface GetQuestionCommentsUseCaseOutput {
  questionComments: QuestionComment[]
}

export class GetQuestionCommentsUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({
    questionId,
    pagination,
  }: GetQuestionCommentsUseCaseInput): Promise<GetQuestionCommentsUseCaseOutput> {
    const questionComments = await this.questionCommentsRepository.findManyByQuestionId(questionId, {
      page: pagination.page,
    })

    return {
      questionComments,
    }
  }
}
