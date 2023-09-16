import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { AnswerFactory } from '@/tests/factories/make-answer'
import { QuestionFactory } from '@/tests/factories/make-question'
import { StudentFactory } from '@/tests/factories/make-student'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

describe('GetQuestionAnswers', () => {
  let app: INestApplication
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
    studentFactory = testingModule.get(StudentFactory)
    questionFactory = testingModule.get(QuestionFactory)
    answerFactory = testingModule.get(AnswerFactory)
    jwt = testingModule.get(JwtService)

    await app.init()
  })

  test('GET /questions/:questionId/answers', async () => {
    const user = await studentFactory.makePrismaStudent()
    const accessToken = jwt.sign({ sub: user.id.value })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const [answer01, answer02] = await Promise.all([
      answerFactory.makePrismaAnswer({
        authorId: user.id,
        content: 'Answer 01',
        questionId: question.id,
      }),
      answerFactory.makePrismaAnswer({
        authorId: user.id,
        content: 'Answer 02',
        questionId: question.id,
      }),
    ])

    const questionId = question.id.value

    const response = await request(app.getHttpServer())
      .get(`/questions/${questionId}/answers`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(HttpStatus.OK)

    expect(response.body).toEqual({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      answers: expect.arrayContaining([
        expect.objectContaining({ content: answer01.content }),
        expect.objectContaining({ content: answer02.content }),
      ]),
    })
  })
})
