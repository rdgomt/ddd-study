import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { QuestionAttachment, QuestionAttachmentProps } from '@/domain/forum/enterprise/entities/question-attachment'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

export function makeQuestionAttachment(override?: Partial<QuestionAttachmentProps>, id?: UniqueEntityID) {
  return QuestionAttachment.create(
    {
      attachmentId: new UniqueEntityID(),
      questionId: new UniqueEntityID(),
      ...override,
    },
    id,
  )
}

@Injectable()
export class QuestionAttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaQuestionAttachment(data: Partial<QuestionAttachmentProps> = {}): Promise<QuestionAttachment> {
    const questionAttachment = makeQuestionAttachment(data)
    const questionId = questionAttachment.questionId.value
    const attachmentId = questionAttachment.attachmentId.value

    await this.prisma.attachment.update({
      data: {
        questionId,
      },
      where: {
        id: attachmentId,
      },
    })

    return questionAttachment
  }
}
