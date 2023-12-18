import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { NotificationFactory } from '@/tests/factories/make-notification'
import { StudentFactory } from '@/tests/factories/make-student'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

describe('Read notification (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let notificationFactory: NotificationFactory
  let jwt: JwtService

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, NotificationFactory],
    }).compile()

    app = testingModule.createNestApplication()
    prisma = testingModule.get(PrismaService)
    studentFactory = testingModule.get(StudentFactory)
    notificationFactory = testingModule.get(NotificationFactory)
    jwt = testingModule.get(JwtService)

    await app.init()
  })

  test('[PATCH] /notifications/:notificationId/read', async () => {
    const user = await studentFactory.makePrismaStudent()
    const accessToken = jwt.sign({ sub: user.id.value })

    const notification = await notificationFactory.makePrismaNotification({
      recipientId: user.id,
    })

    const notificationId = notification.id.value

    const response = await request(app.getHttpServer())
      .patch(`/notifications/${notificationId}/read`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(HttpStatus.NO_CONTENT)

    const notificationOnDatabase = await prisma.notification.findFirst({
      where: {
        recipientId: user.id.value,
      },
    })

    expect(notificationOnDatabase?.readAt).not.toBeNull()
  })
})
