import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { Notification } from '@/domain/notification/enterprise/entities/notification'
import { Prisma, Notification as PrismaNotification } from '@prisma/client'

export class PrismaNotificationMapper {
  static toDomain(raw: PrismaNotification): Notification {
    return Notification.create(
      {
        content: raw.content,
        createdAt: raw.createdAt,
        readAt: raw.readAt,
        recipientId: new UniqueEntityID(raw.recipientId),
        title: raw.title,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(notification: Notification): Prisma.NotificationUncheckedCreateInput {
    return {
      content: notification.content,
      createdAt: notification.createdAt,
      id: notification.id.value,
      readAt: notification.readAt,
      recipientId: notification.recipientId.value,
      title: notification.title,
    }
  }
}
