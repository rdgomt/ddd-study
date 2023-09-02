/* eslint-disable @typescript-eslint/no-unused-vars */
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { Injectable, NotImplementedException } from '@nestjs/common'

@Injectable()
export class PrismaQuestionAttachmentsRepository implements QuestionAttachmentsRepository {
  deleteManyByQuestionId(questionId: string): Promise<void> {
    throw new NotImplementedException()
  }

  findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]> {
    throw new NotImplementedException()
  }
}
