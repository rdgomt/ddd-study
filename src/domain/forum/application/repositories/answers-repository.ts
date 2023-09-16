import { PaginationParams } from '@/core/repositories/pagination-params'
import { AsyncNullable } from '@/utils/typescript/types'
import { Answer } from '../../enterprise/entities/answer'

export abstract class AnswersRepository {
  abstract create: (answer: Answer) => Promise<void>
  abstract delete: (answer: Answer) => Promise<void>
  abstract findById: (answerId: string) => AsyncNullable<Answer>
  abstract findManyByQuestionId: (questionId: string, pagination: PaginationParams) => Promise<Answer[]>
  abstract save: (answer: Answer) => Promise<void>
}
