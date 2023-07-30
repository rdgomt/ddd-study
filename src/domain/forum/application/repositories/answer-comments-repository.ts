import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { AsyncNullable } from '@/utils/typescript/types'

export interface AnswerCommentsRepository {
  create: (answerComment: AnswerComment) => Promise<void>
  delete: (answerComment: AnswerComment) => Promise<void>
  findById: (id: string) => AsyncNullable<AnswerComment>
  findManyByAnswerId: (answerId: string, pagination: PaginationParams) => Promise<AnswerComment[]>
}
