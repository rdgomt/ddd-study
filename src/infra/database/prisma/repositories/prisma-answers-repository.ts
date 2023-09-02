/* eslint-disable @typescript-eslint/no-unused-vars */
import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { AsyncNullable } from '@/utils/typescript/types'
import { Injectable, NotImplementedException } from '@nestjs/common'

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
  create(answer: Answer): Promise<void> {
    throw new NotImplementedException()
  }

  delete(answer: Answer): Promise<void> {
    throw new NotImplementedException()
  }

  findById(answerId: string): AsyncNullable<Answer> {
    throw new NotImplementedException()
  }

  findManyByQuestionId(questionId: string, pagination: PaginationParams): Promise<Answer[]> {
    throw new NotImplementedException()
  }

  save(answer: Answer): Promise<void> {
    throw new NotImplementedException()
  }
}
