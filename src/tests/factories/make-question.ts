import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { CreateQuestionProps, Question } from '@/domain/forum/enterprise/entities/question'
import { faker } from '@faker-js/faker'

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
