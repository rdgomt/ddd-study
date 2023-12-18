import { Nullable } from '@/utils/typescript/types'
import { Notification } from '../../enterprise/entities/notification'

export abstract class NotificationsRepository {
  abstract create: (notification: Notification) => Promise<void>
  abstract findById: (id: string) => Promise<Nullable<Notification>>
  abstract save: (notification: Notification) => Promise<void>
}
