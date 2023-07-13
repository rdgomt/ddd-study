import { PaginationParams } from '@/core/repositories/pagination-params'
import { AsyncNullable } from '@/utils/typescript.utils'
import { QuestionComment } from '../../enterprise/entities/question-comment'

export interface QuestionCommentsRepository {
  create: (questionComment: QuestionComment) => Promise<void>
  delete: (questionComment: QuestionComment) => Promise<void>
  findById: (id: string) => AsyncNullable<QuestionComment>
  findManyByQuestionId: (questionId: string, pagination: PaginationParams) => Promise<QuestionComment[]>
}
