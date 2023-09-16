import { PaginationParams } from '@/core/repositories/pagination-params'
import { AsyncNullable } from '@/utils/typescript/types'
import { QuestionComment } from '../../enterprise/entities/question-comment'

export abstract class QuestionCommentsRepository {
  abstract create: (questionComment: QuestionComment) => Promise<void>
  abstract delete: (questionComment: QuestionComment) => Promise<void>
  abstract findById: (id: string) => AsyncNullable<QuestionComment>
  abstract findManyByQuestionId: (questionId: string, pagination: PaginationParams) => Promise<QuestionComment[]>
}
