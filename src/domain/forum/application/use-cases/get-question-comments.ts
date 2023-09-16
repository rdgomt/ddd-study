import { Either, right } from '@/core/either'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { Injectable } from '@nestjs/common'
import { QuestionComment } from '../../enterprise/entities/question-comment'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'

interface GetQuestionCommentsUseCaseInput {
  pagination: PaginationParams
  questionId: string
}

type GetQuestionCommentsUseCaseOutput = Promise<
  Either<
    void,
    {
      questionComments: QuestionComment[]
    }
  >
>

@Injectable()
export class GetQuestionCommentsUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({ pagination, questionId }: GetQuestionCommentsUseCaseInput): GetQuestionCommentsUseCaseOutput {
    const questionComments = await this.questionCommentsRepository.findManyByQuestionId(questionId, {
      page: pagination.page,
    })

    return right({
      questionComments,
    })
  }
}
