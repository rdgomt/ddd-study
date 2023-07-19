import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { AnswerAttachment, AnswerAttachmentProps } from '@/domain/forum/enterprise/entities/answer-attachment'

export function makeAnswerAttachment(override?: Partial<AnswerAttachmentProps>, id?: UniqueEntityID) {
  return AnswerAttachment.create(
    {
      answerId: new UniqueEntityID(),
      attachmentId: new UniqueEntityID(),
      ...override,
    },
    id,
  )
}
