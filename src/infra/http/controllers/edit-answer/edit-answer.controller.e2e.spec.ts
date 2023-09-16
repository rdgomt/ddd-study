import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { AnswerFactory } from '@/tests/factories/make-answer'
import { QuestionFactory } from '@/tests/factories/make-question'
import { StudentFactory } from '@/tests/factories/make-student'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

describe('EditAnswerController', () => {
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

    await app.init()
  })

  test('PUT /answers/:answerId', async () => {
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

    const body = {
      content: 'new answer content',
    }

    const response = await request(app.getHttpServer())
      .put(`/answers/${answerId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(body)

    expect(response.statusCode).toBe(HttpStatus.NO_CONTENT)

    const answerOnDatabase = await prisma.answer.findFirst({
      where: {
        content: body.content,
      },
    })

    expect(answerOnDatabase).toBeTruthy()
  })
})
