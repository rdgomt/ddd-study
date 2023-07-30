import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { makeNotification } from '@/tests/factories/make-notification'
import { InMemoryNotificationsRepository } from '@/tests/repositories/inm-notifications-repository'
import { ReadNotificationUseCase } from './read-notification'

let notificationsRepository: InMemoryNotificationsRepository
let readNotificationUseCase: ReadNotificationUseCase

describe('Send Notification', () => {
  beforeEach(() => {
    notificationsRepository = new InMemoryNotificationsRepository()
    readNotificationUseCase = new ReadNotificationUseCase(notificationsRepository)
  })

  it('should be able to read a notification', async () => {
    const notification = makeNotification()

    await notificationsRepository.create(notification)

    const result = await readNotificationUseCase.execute({
      notificationId: notification.id.value,
      recipientId: notification.recipientId.value,
    })

    expect(result.isRight()).toBe(true)
    expect(notificationsRepository.items[0]?.readAt).toEqual(expect.any(Date))
  })

  it('should not be able to read a notification from another user', async () => {
    const notification = makeNotification({
      recipientId: new UniqueEntityID('recipient-1'),
    })

    await notificationsRepository.create(notification)

    const result = await readNotificationUseCase.execute({
      notificationId: notification.id.value,
      recipientId: 'recipient-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
