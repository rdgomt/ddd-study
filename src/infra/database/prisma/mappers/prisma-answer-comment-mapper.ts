import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { Prisma, Comment as PrismaComment } from '@prisma/client'

export class PrismaAnswerCommentMapper {
  static toDomain(raw: PrismaComment): AnswerComment {
    if (!raw.answerId) {
      throw new Error('Invalid comment type.')
    }

    return AnswerComment.create(
      {
        answerId: new UniqueEntityID(raw.answerId),
        authorId: new UniqueEntityID(raw.authorId),
        content: raw.content,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(answerComment: AnswerComment): Prisma.CommentUncheckedCreateInput {
    return {
      answerId: answerComment.answerId.value,
      authorId: answerComment.authorId.value,
      content: answerComment.content,
      createdAt: answerComment.createdAt,
      id: answerComment.id.value,
      updatedAt: answerComment.updatedAt,
    }
  }
}
