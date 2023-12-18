import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { ValueObject } from '@/core/entities/value-objects/value-object'
import { Attachment } from '../attachment'
import { Slug } from './slug'

export interface QuestionDetailsProps {
  attachments: Attachment[]
  authorId: UniqueEntityID
  authorName: string
  bestAnswerId?: UniqueEntityID | null
  content: string
  createdAt: Date
  questionId: UniqueEntityID
  slug: Slug
  title: string
  updatedAt?: Date | null
}

export class QuestionDetails extends ValueObject<QuestionDetailsProps> {
  static create(props: QuestionDetailsProps) {
    return new QuestionDetails(props)
  }

  get attachments() {
    return this.props.attachments
  }

  get authorId() {
    return this.props.authorId
  }

  get authorName() {
    return this.props.authorName
  }

  get bestAnswerId() {
    return this.props.bestAnswerId
  }

  get content() {
    return this.props.content
  }

  get createdAt() {
    return this.props.createdAt
  }

  get questionId() {
    return this.props.questionId
  }

  get slug() {
    return this.props.slug
  }

  get title() {
    return this.props.title
  }

  get updatedAt() {
    return this.props.updatedAt
  }
}
