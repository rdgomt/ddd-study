import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { AsyncNullable } from '@/utils/typescript/types'

export abstract class AnswerCommentsRepository {
  abstract create: (answerComment: AnswerComment) => Promise<void>
  abstract delete: (answerComment: AnswerComment) => Promise<void>
  abstract findById: (id: string) => AsyncNullable<AnswerComment>
  abstract findManyByAnswerId: (answerId: string, pagination: PaginationParams) => Promise<AnswerComment[]>
}
