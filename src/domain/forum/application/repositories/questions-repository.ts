import { PaginationParams } from '@/core/repositories/pagination-params'
import { Nullable } from '@/utils/typescript.utils'
import { Question } from '../../enterprise/entities/question'

export interface QuestionsRepository {
  create: (question: Question) => Promise<void>
  delete: (question: Question) => Promise<void>
  findById: (questionId: string) => Promise<Nullable<Question>>
  findBySlug: (slug: string) => Promise<Nullable<Question>>
  findManyRecent: (params: PaginationParams) => Promise<Question[]>
  save: (question: Question) => Promise<void>
}
