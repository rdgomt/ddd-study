import { Either, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { Notification } from '../../enterprise/entities/notification'
import { NotificationsRepository } from '../repositories/notifications-repository'

export interface SendNotificationUseCaseInput {
  content: string
  recipientId: string
  title: string
}

export type SendNotificationUseCaseOutput = Promise<
  Either<
    null,
    {
      notification: Notification
    }
  >
>

export class SendNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({ content, recipientId, title }: SendNotificationUseCaseInput): SendNotificationUseCaseOutput {
    const notification = Notification.create({
      content,
      recipientId: new UniqueEntityID(recipientId),
      title,
    })

    await this.notificationsRepository.create(notification)

    return right({
      notification,
    })
  }
}
