import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { CreateQuestionCommentProps, QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { faker } from '@faker-js/faker'

export function makeQuestionComment(override?: Partial<CreateQuestionCommentProps>, id?: UniqueEntityID) {
  return QuestionComment.create(
    {
      authorId: new UniqueEntityID(),
      questionId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  )
}
