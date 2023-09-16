import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { Prisma, Answer as PrismaAnswer } from '@prisma/client'

export class PrismaAnswerMapper {
  static toDomain(raw: PrismaAnswer): Answer {
    return Answer.create(
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

  static toPrisma(answer: Answer): Prisma.AnswerUncheckedCreateInput {
    return {
      authorId: answer.authorId.value,
      content: answer.content,
      createdAt: answer.createdAt,
      id: answer.id.value,
      questionId: answer.questionId.value,
      updatedAt: answer.updatedAt,
    }
  }
}
