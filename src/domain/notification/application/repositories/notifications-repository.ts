import { Nullable } from '@/utils/typescript/types'
import { Notification } from '../../enterprise/entities/notification'

export interface NotificationsRepository {
  create: (notification: Notification) => Promise<void>
  findById: (id: string) => Promise<Nullable<Notification>>
  save: (notification: Notification) => Promise<void>
}
