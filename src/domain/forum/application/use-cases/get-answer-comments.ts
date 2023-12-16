import { Either, right } from '@/core/either'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { Injectable } from '@nestjs/common'
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'

interface GetAnswerCommentsUseCaseInput {
  answerId: string
  pagination: PaginationParams
}

type GetAnswerCommentsUseCaseOutput = Promise<
  Either<
    void,
    {
      comments: CommentWithAuthor[]
    }
  >
>

@Injectable()
export class GetAnswerCommentsUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({ answerId, pagination }: GetAnswerCommentsUseCaseInput): GetAnswerCommentsUseCaseOutput {
    const comments = await this.answerCommentsRepository.findManyByAnswerIdWithAuthor(answerId, {
      page: pagination.page,
    })

    return right({
      comments,
    })
  }
}
