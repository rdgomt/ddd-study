import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { Prisma, Question as PrismaQuestion } from '@prisma/client'

export class PrismaQuestionMapper {
  static toDomain(question: PrismaQuestion): Question {
    return Question.create(
      {
        authorId: new UniqueEntityID(question.authorId),
        bestAnswerId: question.bestAnswerId ? new UniqueEntityID(question.bestAnswerId) : null,
        content: question.content,
        createdAt: question.createdAt,
        slug: Slug.create(question.slug),
        title: question.title,
        updatedAt: question.updatedAt,
      },
      new UniqueEntityID(question.id),
    )
  }

  static toPrisma(question: Question): Prisma.QuestionUncheckedCreateInput {
    return {
      authorId: question.authorId.value,
      bestAnswerId: question.bestAnswerId?.value,
      content: question.content,
      createdAt: question.createdAt,
      id: question.id.value,
      slug: question.slug.value,
      title: question.title,
      updatedAt: question.updatedAt,
    }
  }
}
