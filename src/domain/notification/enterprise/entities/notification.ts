import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { Optional } from '@/utils/typescript.utils'

interface NotificationProps {
  content: string
  createdAt: Date
  readAt?: Date
  recipientId: UniqueEntityID
  title: string
}

export type CreateNotificationProps = Optional<NotificationProps, 'createdAt'>

export class Notification extends Entity<NotificationProps> {
  static create(props: CreateNotificationProps, id?: UniqueEntityID) {
    return new Notification(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }

  get content() {
    return this.props.content
  }

  get createdAt() {
    return this.props.createdAt
  }

  get readAt() {
    return this.props.readAt
  }

  get recipientId() {
    return this.props.recipientId
  }

  get title() {
    return this.props.title
  }

  read() {
    this.props.readAt = new Date()
  }
}
