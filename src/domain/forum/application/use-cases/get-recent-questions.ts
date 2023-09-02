import { Either, right } from '@/core/either'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { Injectable } from '@nestjs/common'
import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'

type GetRecentQuestionsUseCaseInput = PaginationParams

type GetRecentQuestionsUseCaseOutput = Promise<
  Either<
    void,
    {
      questions: Question[]
    }
  >
>

@Injectable()
export class GetRecentQuestionsUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({ page }: GetRecentQuestionsUseCaseInput): GetRecentQuestionsUseCaseOutput {
    const questions = await this.questionsRepository.findManyRecent({ page })

    return right({
      questions,
    })
  }
}
