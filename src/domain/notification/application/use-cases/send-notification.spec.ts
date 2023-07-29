import { InMemoryNotificationsRepository } from '@/test/repositories/inm-notifications-repository'
import { SendNotificationUseCase } from './send-notification'

let notificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase

describe('Send Notification', () => {
  beforeEach(() => {
    notificationsRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(notificationsRepository)
  })

  it('should be able to send a notification', async () => {
    const result = await sendNotificationUseCase.execute({
      content: 'Conteúdo da notificação',
      recipientId: '1',
      title: 'Nova notificação',
    })

    expect(result.isRight()).toBe(true)

    expect(notificationsRepository.items[0]).toEqual(result.value?.notification)
  })
})
