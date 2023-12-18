import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { Attachment as PrismaAttachment, Question as PrismaQuestion, User as PrismaUser } from '@prisma/client'
import { PrismaAttachmentMapper } from './prisma-attachment-mapper'

type PrismaQuestionDetails = PrismaQuestion & {
  attachments: PrismaAttachment[]
  author: PrismaUser
}

export class PrismaQuestionDetailsMapper {
  static toDomain(raw: PrismaQuestionDetails): QuestionDetails {
    return QuestionDetails.create({
      attachments: raw.attachments.map((attachment) => PrismaAttachmentMapper.toDomain(attachment)),
      authorId: new UniqueEntityID(raw.author.id),
      authorName: raw.author.name,
      bestAnswerId: raw.bestAnswerId ? new UniqueEntityID(raw.bestAnswerId) : null,
      content: raw.content,
      createdAt: raw.createdAt,
      questionId: new UniqueEntityID(raw.id),
      slug: Slug.create(raw.slug),
      title: raw.title,
      updatedAt: raw.updatedAt,
    })
  }
}
