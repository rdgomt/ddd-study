import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { Prisma, Attachment as PrismaAttachment } from '@prisma/client'

export class PrismaAnswerAttachmentMapper {
  static toDomain(raw: PrismaAttachment): AnswerAttachment {
    if (!raw.answerId) {
      throw new Error('Invalid attachment type.')
    }

    return AnswerAttachment.create(
      {
        answerId: new UniqueEntityID(raw.answerId),
        attachmentId: new UniqueEntityID(raw.id),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrismaUpdateMany(attachments: AnswerAttachment[]): Prisma.AttachmentUpdateManyArgs {
    const attachmentIds = attachments.map((attachment) => {
      return attachment.attachmentId.value
    })

    return {
      data: {
        answerId: attachments[0]?.answerId.value,
      },
      where: {
        id: {
          in: attachmentIds,
        },
      },
    }
  }

  static toPrismaDeleteMany(attachments: AnswerAttachment[]): Prisma.AttachmentDeleteManyArgs {
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
