import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { AnswerFactory } from '@/tests/factories/make-answer'
import { AnswerCommentFactory } from '@/tests/factories/make-answer-comment'
import { QuestionFactory } from '@/tests/factories/make-question'
import { StudentFactory } from '@/tests/factories/make-student'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

describe('GetAnswerCommentsController', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory
  let answerCommentFactory: AnswerCommentFactory
  let jwt: JwtService

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory, AnswerCommentFactory],
    }).compile()

    app = testingModule.createNestApplication()
    studentFactory = testingModule.get(StudentFactory)
    questionFactory = testingModule.get(QuestionFactory)
    answerFactory = testingModule.get(AnswerFactory)
    answerCommentFactory = testingModule.get(AnswerCommentFactory)
    jwt = testingModule.get(JwtService)

    await app.init()
  })

  test('GET /answers/:answerId/comments', async () => {
    const user = await studentFactory.makePrismaStudent()
    const accessToken = jwt.sign({ sub: user.id.value })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const answer = await answerFactory.makePrismaAnswer({
      authorId: user.id,
      questionId: question.id,
    })

    const [answerComment01, answerComment02] = await Promise.all([
      answerCommentFactory.makePrismaAnswerComment({
        answerId: answer.id,
        authorId: user.id,
      }),
      answerCommentFactory.makePrismaAnswerComment({
        answerId: answer.id,
        authorId: user.id,
      }),
    ])

    const response = await request(app.getHttpServer())
      .get(`/answers/${answer.id.value}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(HttpStatus.OK)

    expect(response.body).toEqual({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      comments: expect.arrayContaining([
        expect.objectContaining({ content: answerComment01.content }),
        expect.objectContaining({ content: answerComment02.content }),
      ]),
    })
  })
})
