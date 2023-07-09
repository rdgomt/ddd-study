import { PaginationParams } from '@/core/repositories/pagination-params'
import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'

type GetRecentQuestionsUseCaseInput = PaginationParams

interface GetRecentQuestionsUseCaseOutput {
  questions: Question[]
}

export class GetRecentQuestionsUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({ page }: GetRecentQuestionsUseCaseInput): Promise<GetRecentQuestionsUseCaseOutput> {
    const questions = await this.questionsRepository.findManyRecent({ page })

    return {
      questions,
    }
  }
}
