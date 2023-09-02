/* eslint-disable @typescript-eslint/no-unused-vars */
import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { AsyncNullable } from '@/utils/typescript/types'
import { Injectable, NotImplementedException } from '@nestjs/common'

@Injectable()
export class PrismaAnswerCommentsRepository implements AnswerCommentsRepository {
  create(answerComment: AnswerComment): Promise<void> {
    throw new NotImplementedException()
  }

  delete(answerComment: AnswerComment): Promise<void> {
    throw new NotImplementedException()
  }

  findById(id: string): AsyncNullable<AnswerComment> {
    throw new NotImplementedException()
  }

  findManyByAnswerId(answerId: string, pagination: PaginationParams): Promise<AnswerComment[]> {
    throw new NotImplementedException()
  }
}
