import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { CreateAnswerCommentProps, AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { faker } from '@faker-js/faker'

export function makeAnswerComment(override?: Partial<CreateAnswerCommentProps>, id?: UniqueEntityID) {
  return AnswerComment.create(
    {
      authorId: new UniqueEntityID(),
      answerId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  )
}
