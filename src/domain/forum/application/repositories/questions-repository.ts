import { PaginationParams } from '@/core/repositories/pagination-params'
import { AsyncNullable } from '@/utils/typescript/types'
import { Question } from '../../enterprise/entities/question'
import { QuestionDetails } from '../../enterprise/entities/value-objects/question-details'

export abstract class QuestionsRepository {
  abstract create: (question: Question) => Promise<void>
  abstract delete: (question: Question) => Promise<void>
  abstract findById: (questionId: string) => AsyncNullable<Question>
  abstract findBySlug: (slug: string) => AsyncNullable<Question>
  abstract findDetailsBySlug(slug: string): AsyncNullable<QuestionDetails>
  abstract findManyRecent: (params: PaginationParams) => Promise<Question[]>
  abstract save: (question: Question) => Promise<void>
}
