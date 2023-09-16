import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { CreateQuestionProps, Question } from '@/domain/forum/enterprise/entities/question'
import { PrismaQuestionMapper } from '@/infra/database/prisma/mappers/prisma-question-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeQuestion(override?: Partial<CreateQuestionProps>, id?: UniqueEntityID) {
  return Question.create(
    {
      authorId: new UniqueEntityID(),
      content: faker.lorem.text(),
      title: faker.lorem.sentence(),
      ...override,
    },
    id,
  )
}

@Injectable()
export class QuestionFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaQuestion(data: Partial<CreateQuestionProps> = {}): Promise<Question> {
    const question = makeQuestion(data)

    await this.prisma.question.create({
      data: PrismaQuestionMapper.toPrisma(question),
    })

    return question
  }
}
