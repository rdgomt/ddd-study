import { Either, right } from '@/core/either'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { Injectable } from '@nestjs/common'
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'

interface GetQuestionCommentsUseCaseInput {
  pagination: PaginationParams
  questionId: string
}

type GetQuestionCommentsUseCaseOutput = Promise<
  Either<
    void,
    {
      comments: CommentWithAuthor[]
    }
  >
>

@Injectable()
export class GetQuestionCommentsUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({ pagination, questionId }: GetQuestionCommentsUseCaseInput): GetQuestionCommentsUseCaseOutput {
    const comments = await this.questionCommentsRepository.findManyByQuestionIdWithAuthor(questionId, {
      page: pagination.page,
    })

    return right({
      comments,
    })
  }
}
