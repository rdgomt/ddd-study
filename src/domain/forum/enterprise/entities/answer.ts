import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { now } from '@/utils/date.utils'

const MAX_CONTENT_LENGTH = 120

export interface AnswerProps {
  authorId: UniqueEntityID
  content: string
  createdAt: Date
  questionId: UniqueEntityID
  updatedAt?: Date
}

export class Answer extends Entity<AnswerProps> {
  static create(props: Omit<AnswerProps, 'createdAt'>, id?: UniqueEntityID) {
    return new Answer(
      {
        ...props,
        createdAt: now(),
      },
      id,
    )
  }

  get authorId() {
    return this.props.authorId
  }

  get questionId() {
    return this.props.questionId
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get content() {
    return this.props.content
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  get excerpt() {
    return [...this.content.slice(0, MAX_CONTENT_LENGTH).trimEnd(), '...']
  }

  private touch() {
    this.props.updatedAt = new Date()
  }
}
