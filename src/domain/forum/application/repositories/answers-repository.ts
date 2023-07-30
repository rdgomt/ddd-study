import { PaginationParams } from '@/core/repositories/pagination-params'
import { AsyncNullable } from '@/utils/typescript/types'
import { Answer } from '../../enterprise/entities/answer'

export interface AnswersRepository {
  create: (answer: Answer) => Promise<void>
  delete: (answer: Answer) => Promise<void>
  findById: (answerId: string) => AsyncNullable<Answer>
  findManyByQuestionId: (questionId: string, pagination: PaginationParams) => Promise<Answer[]>
  save: (answer: Answer) => Promise<void>
}
