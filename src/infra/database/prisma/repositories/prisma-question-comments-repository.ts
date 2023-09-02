/* eslint-disable @typescript-eslint/no-unused-vars */
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { AsyncNullable } from '@/utils/typescript/types'
import { Injectable, NotImplementedException } from '@nestjs/common'

@Injectable()
export class PrismaQuestionCommentsRepository implements QuestionCommentsRepository {
  create(questionComment: QuestionComment): Promise<void> {
    throw new NotImplementedException()
  }

  delete(questionComment: QuestionComment): Promise<void> {
    throw new NotImplementedException()
  }

  findById(id: string): AsyncNullable<QuestionComment> {
    throw new NotImplementedException()
  }

  findManyByQuestionId(questionId: string, pagination: PaginationParams): Promise<QuestionComment[]> {
    throw new NotImplementedException()
  }
}
