import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { now } from '@/utils/date.utils'
import { Optional } from '@/utils/typescript.utils'
import { AnswerCreatedEvent } from '../events/answer-created-event'
import { AnswerAttachmentsList } from './answer-attachment-list'

const MAX_CONTENT_LENGTH = 120

export interface AnswerProps {
  attachments: AnswerAttachmentsList
  authorId: UniqueEntityID
  content: string
  createdAt: Date
  questionId: UniqueEntityID
  updatedAt?: Date
}

export type CreateAnswerProps = Optional<Omit<AnswerProps, 'updatedAt'>, 'createdAt' | 'attachments'>

export class Answer extends AggregateRoot<AnswerProps> {
  static create(props: CreateAnswerProps, id?: UniqueEntityID) {
    const answer = new Answer(
      {
        ...props,
        attachments: props.attachments ?? new AnswerAttachmentsList(),
        createdAt: now(),
      },
      id,
    )

    const isNewAnswer = !id

    if (isNewAnswer) {
      answer.addDomainEvent(new AnswerCreatedEvent(answer))
    }

    return answer
  }

  get attachments() {
    return this.props.attachments
  }

  set attachments(attachments: AnswerAttachmentsList) {
    this.props.attachments = attachments
    this.touch()
  }

  get authorId() {
    return this.props.authorId
  }

  get content() {
    return this.props.content
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get excerpt() {
    return `${this.content.slice(0, MAX_CONTENT_LENGTH).trimEnd()}...`
  }

  get questionId() {
    return this.props.questionId
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }
}
