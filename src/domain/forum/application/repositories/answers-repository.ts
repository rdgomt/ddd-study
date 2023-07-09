import { Nullable } from 'vitest'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { Answer } from '../../enterprise/entities/answer'

export interface AnswersRepository {
  create: (answer: Answer) => Promise<void>
  delete: (answer: Answer) => Promise<void>
  findById: (answerId: string) => Promise<Nullable<Answer>>
  findManyByQuestionId: (questionId: string, pagination: PaginationParams) => Promise<Answer[]>
  save: (answer: Answer) => Promise<void>
}
