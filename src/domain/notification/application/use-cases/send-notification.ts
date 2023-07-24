import { Either, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { Notification } from '../../enterprise/entities/notification'
import { NotificationsRepository } from '../repositories/notifications-repository'

interface SendNotificationUseCaseInput {
  content: string
  recipientId: string
  title: string
}

type SendNotificationUseCaseOutput = Promise<
  Either<
    null,
    {
      notification: Notification
    }
  >
>

export class SendNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({ recipientId, title, content }: SendNotificationUseCaseInput): SendNotificationUseCaseOutput {
    const notification = Notification.create({
      recipientId: new UniqueEntityID(recipientId),
      title,
      content,
    })

    await this.notificationsRepository.create(notification)

    return right({
      notification,
    })
  }
}
