import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { CreateQuestionProps, Question } from '@/domain/forum/enterprise/entities/question'
import { faker } from '@faker-js/faker'

export function makeQuestion(override?: Partial<CreateQuestionProps>, id?: UniqueEntityID) {
  return Question.create(
    {
      authorId: new UniqueEntityID(),
      title: faker.lorem.sentence(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  )
}
