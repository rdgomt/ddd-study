import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { Prisma, Attachment as PrismaAttachment } from '@prisma/client'

export class PrismaQuestionAttachmentMapper {
  static toDomain(raw: PrismaAttachment): QuestionAttachment {
    if (!raw.questionId) {
      throw new Error('Invalid attachment type.')
    }

    return QuestionAttachment.create(
      {
        attachmentId: new UniqueEntityID(raw.id),
        questionId: new UniqueEntityID(raw.questionId),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrismaUpdateMany(attachments: QuestionAttachment[]): Prisma.AttachmentUpdateManyArgs {
    const attachmentIds = attachments.map((attachment) => {
      return attachment.attachmentId.value
    })

    return {
      data: {
        questionId: attachments[0]?.questionId.value,
      },
      where: {
        id: {
          in: attachmentIds,
        },
      },
    }
  }

  static toPrismaDeleteMany(attachments: QuestionAttachment[]): Prisma.AttachmentDeleteManyArgs {
    const attachmentIds = attachments.map((attachment) => {
      return attachment.attachmentId.value
    })

    return {
      where: {
        id: {
          in: attachmentIds,
        },
      },
    }
  }
}
