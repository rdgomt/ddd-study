import { Either, right } from '@/core/either'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { Injectable } from '@nestjs/common'
import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'

interface GetQuestionAnswersUseCaseInput {
  pagination: PaginationParams
  questionId: string
}

type GetQuestionAnswersUseCaseOutput = Promise<
  Either<
    void,
    {
      answers: Answer[]
    }
  >
>

@Injectable()
export class GetQuestionAnswersUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({ pagination, questionId }: GetQuestionAnswersUseCaseInput): GetQuestionAnswersUseCaseOutput {
    const answers = await this.answersRepository.findManyByQuestionId(questionId, { page: pagination.page })

    return right({
      answers,
    })
  }
}
