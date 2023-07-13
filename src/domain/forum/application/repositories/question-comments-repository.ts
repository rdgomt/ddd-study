import { PaginationParams } from '@/core/repositories/pagination-params'
import { Nullable } from '@/utils/typescript.utils'
import { QuestionComment } from '../../enterprise/entities/question-comment'

export interface QuestionCommentsRepository {
  create: (questionComment: QuestionComment) => Promise<void>
  delete: (questionComment: QuestionComment) => Promise<void>
  findById: (id: string) => Promise<Nullable<QuestionComment>>
  findManyByQuestionId: (questionId: string, pagination: PaginationParams) => Promise<QuestionComment[]>
}
