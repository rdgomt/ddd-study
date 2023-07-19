import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'

export interface QuestionAttachmentProps {
  attachmentId: UniqueEntityID
  questionId: UniqueEntityID
}

export class QuestionAttachment extends Entity<QuestionAttachmentProps> {
  static create(props: QuestionAttachmentProps, id?: UniqueEntityID) {
    return new QuestionAttachment(props, id)
  }

  get attachmentId() {
    return this.props.attachmentId
  }

  get questionId() {
    return this.props.questionId
  }
}
