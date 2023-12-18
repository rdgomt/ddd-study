import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification'
import { AuthUser } from '@/infra/auth/auth-user.decorator'
import { BadRequestException, Controller, HttpCode, HttpStatus, Param, Patch } from '@nestjs/common'

@Controller('/notifications/:notificationId/read')
export class ReadNotificationController {
  constructor(private readNotification: ReadNotificationUseCase) {}

  @Patch()
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(@AuthUser('sub') recipientId: string, @Param('notificationId') notificationId: string) {
    const result = await this.readNotification.execute({
      notificationId,
      recipientId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
