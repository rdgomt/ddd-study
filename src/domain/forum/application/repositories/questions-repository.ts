import { PaginationParams } from '@/core/repositories/pagination-params'
import { AsyncNullable } from '@/utils/typescript/types'
import { Question } from '../../enterprise/entities/question'

export interface QuestionsRepository {
  create: (question: Question) => Promise<void>
  delete: (question: Question) => Promise<void>
  findById: (questionId: string) => AsyncNullable<Question>
  findBySlug: (slug: string) => AsyncNullable<Question>
  findManyRecent: (params: PaginationParams) => Promise<Question[]>
  save: (question: Question) => Promise<void>
}
