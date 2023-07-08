import dayjs from 'dayjs'
import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { now } from '@/utils/date.utils'
import { Slug } from './value-objects/slug'

const MAX_CONTENT_LENGTH = 120 // TODO: create VO for content

interface QuestionProps {
  authorId: UniqueEntityID
  bestAnswerId?: UniqueEntityID
  title: string
  content: string
  slug: Slug
  createdAt: Date
  updatedAt?: Date
}

export class Question extends Entity<QuestionProps> {
  static create(props: Omit<QuestionProps, 'createdAt' | 'slug'>, id?: UniqueEntityID) {
    return new Question(
      {
        ...props,
        slug: Slug.createFromText(props.title),
        createdAt: now(),
      },
      id,
    )
  }

  get authorId() {
    return this.props.authorId
  }

  get bestAnswerId() {
    return this.props.bestAnswerId
  }

  set bestAnswerId(bestAnswerId: UniqueEntityID | undefined) {
    this.props.bestAnswerId = bestAnswerId
    this.touch()
  }

  get title() {
    return this.props.title
  }

  set title(title: string) {
    this.props.title = title
    this.props.slug = Slug.createFromText(title)

    this.touch()
  }

  get content() {
    return this.props.content
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  get slug() {
    return this.props.slug
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get isNew(): boolean {
    return dayjs().diff(this.createdAt, 'days') <= 3
  }

  get excerpt() {
    return [...this.content.slice(0, MAX_CONTENT_LENGTH).trimEnd(), '...']
  }

  private touch() {
    this.props.updatedAt = new Date()
  }
}
