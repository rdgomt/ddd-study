import { PaginationParams } from '@/core/repositories/pagination-params'
import { AsyncNullable } from '@/utils/typescript/types'
import { Question } from '../../enterprise/entities/question'

export abstract class QuestionsRepository {
  abstract create: (question: Question) => Promise<void>
  abstract delete: (question: Question) => Promise<void>
  abstract findById: (questionId: string) => AsyncNullable<Question>
  abstract findBySlug: (slug: string) => AsyncNullable<Question>
  abstract findManyRecent: (params: PaginationParams) => Promise<Question[]>
  abstract save: (question: Question) => Promise<void>
}
