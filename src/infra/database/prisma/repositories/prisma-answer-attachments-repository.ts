/* eslint-disable @typescript-eslint/no-unused-vars */
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { Injectable, NotImplementedException } from '@nestjs/common'

@Injectable()
export class PrismaAnswerAttachmentsRepository implements AnswerAttachmentsRepository {
  deleteManyByAnswerId(answerId: string): Promise<void> {
    throw new NotImplementedException()
  }

  findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    throw new NotImplementedException()
  }
}
