import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { AnswerAttachment, AnswerAttachmentProps } from '@/domain/forum/enterprise/entities/answer-attachment'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

export function makeAnswerAttachment(override?: Partial<AnswerAttachmentProps>, id?: UniqueEntityID) {
  return AnswerAttachment.create(
    {
      answerId: new UniqueEntityID(),
      attachmentId: new UniqueEntityID(),
      ...override,
    },
    id,
  )
}

@Injectable()
export class AnswerAttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAnswerAttachment(data: Partial<AnswerAttachmentProps> = {}): Promise<AnswerAttachment> {
    const answerAttachment = makeAnswerAttachment(data)
    const answerId = answerAttachment.answerId.value
    const attachmentId = answerAttachment.attachmentId.value

    await this.prisma.attachment.update({
      data: {
        answerId,
      },
      where: {
        id: attachmentId,
      },
    })

    return answerAttachment
  }
}
