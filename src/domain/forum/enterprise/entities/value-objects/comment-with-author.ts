import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { ValueObject } from '@/core/entities/value-objects/value-object'

export interface CommentWithAuthorProps {
  authorId: UniqueEntityID
  authorName: string
  commentId: UniqueEntityID
  content: string
  createdAt: Date
  updatedAt?: Date | null
}

export class CommentWithAuthor extends ValueObject<CommentWithAuthorProps> {
  static create(props: CommentWithAuthorProps) {
    return new CommentWithAuthor(props)
  }

  get authorId() {
    return this.props.authorId
  }

  get authorName() {
    return this.props.authorName
  }

  get commentId() {
    return this.props.commentId
  }

  get content() {
    return this.props.content
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }
}
