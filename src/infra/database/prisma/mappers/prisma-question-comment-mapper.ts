import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { Prisma, Comment as PrismaComment } from '@prisma/client'

export class PrismaQuestionCommentMapper {
  static toDomain(raw: PrismaComment): QuestionComment {
    if (!raw.questionId) {
      throw new Error('Invalid comment type.')
    }

    return QuestionComment.create(
      {
        authorId: new UniqueEntityID(raw.authorId),
        content: raw.content,
        createdAt: raw.createdAt,
        questionId: new UniqueEntityID(raw.questionId),
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(questionComment: QuestionComment): Prisma.CommentUncheckedCreateInput {
    return {
      authorId: questionComment.authorId.value,
      content: questionComment.content,
      createdAt: questionComment.createdAt,
      id: questionComment.id.value,
      questionId: questionComment.questionId.value,
      updatedAt: questionComment.updatedAt,
    }
  }
}
