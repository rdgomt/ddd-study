import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { CreateNotificationProps, Notification } from '@/domain/notification/enterprise/entities/notification'
import { faker } from '@faker-js/faker'

export function makeNotification(override?: Partial<CreateNotificationProps>, id?: UniqueEntityID) {
  return Notification.create(
    {
      content: faker.lorem.sentence(),
      recipientId: new UniqueEntityID(),
      title: faker.lorem.sentence(),
      ...override,
    },
    id,
  )
}
