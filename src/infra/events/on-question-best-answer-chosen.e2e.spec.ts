import request from 'supertest'
import { DomainEvents } from '@/core/events/domain-events'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { AnswerFactory } from '@/tests/factories/make-answer'
import { QuestionFactory } from '@/tests/factories/make-question'
import { StudentFactory } from '@/tests/factories/make-student'
import { waitFor } from '@/utils/fn/wait-for'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

describe('On question best answer chosen (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory
  let jwt: JwtService

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory],
    }).compile()

    app = testingModule.createNestApplication()

    prisma = testingModule.get(PrismaService)
    studentFactory = testingModule.get(StudentFactory)
    questionFactory = testingModule.get(QuestionFactory)
    answerFactory = testingModule.get(AnswerFactory)
    jwt = testingModule.get(JwtService)

    DomainEvents.shouldRun = true

    await app.init()
  })

  it('should send a notification when question best answer is chosen', async () => {
    const user = await studentFactory.makePrismaStudent()
    const accessToken = jwt.sign({ sub: user.id.value })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const answer = await answerFactory.makePrismaAnswer({
      authorId: user.id,
      questionId: question.id,
    })

    const answerId = answer.id.value

    await request(app.getHttpServer())
      .patch(`/answers/${answerId}/choose-as-best`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

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
