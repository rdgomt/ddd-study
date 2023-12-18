import request from 'supertest'
import { DomainEvents } from '@/core/events/domain-events'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { QuestionFactory } from '@/tests/factories/make-question'
import { StudentFactory } from '@/tests/factories/make-student'
import { waitFor } from '@/utils/fn/wait-for'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

describe('On answer created (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let jwt: JwtService

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile()

    app = testingModule.createNestApplication()

    prisma = testingModule.get(PrismaService)
    studentFactory = testingModule.get(StudentFactory)
    questionFactory = testingModule.get(QuestionFactory)
    jwt = testingModule.get(JwtService)

    DomainEvents.shouldRun = true

    await app.init()
  })

  it('should send a notification when answer is created', async () => {
    const user = await studentFactory.makePrismaStudent()
    const accessToken = jwt.sign({ sub: user.id.value })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const questionId = question.id.value

    await request(app.getHttpServer())
      .post(`/questions/${questionId}/answers`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        attachments: [],
        content: 'New answer',
      })

    await waitFor(async () => {
      const notificationOnDatabase = await prisma.notification.findFirst({
        where: {
          recipientId: user.id.value,
        },
      })

      expect(notificationOnDatabase).not.toBeNull()
    })
  })
})
