import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'

interface GetAnswerCommentsUseCaseInput {
  answerId: string
  pagination: PaginationParams
}

interface GetAnswerCommentsUseCaseOutput {
  answerComments: AnswerComment[]
}

export class GetAnswerCommentsUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({ answerId, pagination }: GetAnswerCommentsUseCaseInput): Promise<GetAnswerCommentsUseCaseOutput> {
    const answerComments = await this.answerCommentsRepository.findManyByAnswerId(answerId, {
      page: pagination.page,
    })

    return {
      answerComments,
    }
  }
}
