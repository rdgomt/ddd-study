import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'

const EXCERPT_LENGTH = 120

export interface CommentProps {
  authorId: UniqueEntityID
  content: string
  createdAt: Date
  updatedAt?: Date
}

export abstract class Comment<Props extends CommentProps> extends AggregateRoot<Props> {
  private touch() {
    this.props.updatedAt = new Date()
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

  // TODO: create a value object for excerpt
  get excerpt() {
    return `${this.content.slice(0, EXCERPT_LENGTH).trimEnd()}...`
  }

  get updatedAt() {
    return this.props.updatedAt
  }
}
