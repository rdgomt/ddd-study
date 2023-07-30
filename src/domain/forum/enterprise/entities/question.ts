import dayjs from 'dayjs'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { Excerpt } from '@/domain/forum/enterprise/entities/value-objects/excerpt'
import { now } from '@/utils/date/now'
import { Optional } from '@/utils/typescript/types'
import { QuestionBestAnswerChosenEvent } from '../events/question-best-answer-chosen-event'
import { QuestionAttachmentsList } from './question-attachments-list'
import { Slug } from './value-objects/slug'

export interface QuestionProps {
  attachments: QuestionAttachmentsList
  authorId: UniqueEntityID
  bestAnswerId?: UniqueEntityID
  content: string
  createdAt: Date
  slug: Slug
  title: string
  updatedAt?: Date
}

export type CreateQuestionProps = Optional<Omit<QuestionProps, 'slug' | 'updatedAt'>, 'createdAt' | 'attachments'>

export class Question extends AggregateRoot<QuestionProps> {
  static create(props: CreateQuestionProps, id?: UniqueEntityID) {
    return new Question(
      {
        ...props,
        attachments: props.attachments ?? new QuestionAttachmentsList(),
        createdAt: props.createdAt ?? now(),
        slug: Slug.createFromText(props.title),
      },
      id,
    )
  }

  get attachments() {
    return this.props.attachments
  }

  set attachments(attachments: QuestionAttachmentsList) {
    this.props.attachments = attachments
    this.touch()
  }

  get authorId() {
    return this.props.authorId
  }

  get bestAnswerId() {
    return this.props.bestAnswerId
  }

  set bestAnswerId(bestAnswerId: UniqueEntityID | undefined) {
    if (bestAnswerId && bestAnswerId !== this.props.bestAnswerId) {
      this.addDomainEvent(new QuestionBestAnswerChosenEvent(this, bestAnswerId))
    }

    this.props.bestAnswerId = bestAnswerId
    this.touch()
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
    return new Excerpt(this.content).value
  }

  get isNew(): boolean {
    return dayjs().diff(this.createdAt, 'days') <= 3
  }

  get slug() {
    return this.props.slug
  }

  get title() {
    return this.props.title
  }

  set title(title: string) {
    this.props.title = title
    this.props.slug = Slug.createFromText(title)

    this.touch()
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }
}
