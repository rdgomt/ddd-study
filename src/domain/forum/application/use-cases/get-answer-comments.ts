import { Either, right } from '@/core/either'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'

interface GetAnswerCommentsUseCaseInput {
  answerId: string
  pagination: PaginationParams
}

type GetAnswerCommentsUseCaseOutput = Promise<
  Either<
    void,
    {
      answerComments: AnswerComment[]
    }
  >
>

export class GetAnswerCommentsUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({ answerId, pagination }: GetAnswerCommentsUseCaseInput): GetAnswerCommentsUseCaseOutput {
    const answerComments = await this.answerCommentsRepository.findManyByAnswerId(answerId, {
      page: pagination.page,
    })

    return right({
      answerComments,
    })
  }
}
