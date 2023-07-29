import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { QuestionAttachment, QuestionAttachmentProps } from '@/domain/forum/enterprise/entities/question-attachment'

export function makeQuestionAttachment(override?: Partial<QuestionAttachmentProps>, id?: UniqueEntityID) {
  return QuestionAttachment.create(
    {
      attachmentId: new UniqueEntityID(),
      questionId: new UniqueEntityID(),
      ...override,
    },
    id,
  )
}
