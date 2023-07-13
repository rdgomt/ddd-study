import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { Nullable } from '@/utils/typescript.utils'

export interface AnswerCommentsRepository {
  create: (answerComment: AnswerComment) => Promise<void>
  delete: (answerComment: AnswerComment) => Promise<void>
  findById: (id: string) => Promise<Nullable<AnswerComment>>
  findManyByAnswerId: (answerId: string, pagination: PaginationParams) => Promise<AnswerComment[]>
}
