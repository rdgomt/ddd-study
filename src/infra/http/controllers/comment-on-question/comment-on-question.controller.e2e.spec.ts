import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { QuestionFactory } from '@/tests/factories/make-question'
import { StudentFactory } from '@/tests/factories/make-student'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

describe('CommentOnQuestionController', () => {
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

    await app.init()
  })

  test('POST /questions/:questionId/comments', async () => {
    const user = await studentFactory.makePrismaStudent()
    const accessToken = jwt.sign({ sub: user.id.value })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const questionId = question.id.value

    const body = {
      content: 'new comment',
    }

    const response = await request(app.getHttpServer())
      .post(`/questions/${questionId}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(body)

    expect(response.statusCode).toBe(HttpStatus.CREATED)

    const commentOnDatabase = await prisma.comment.findFirst({
      where: {
        content: body.content,
      },
    })

    expect(commentOnDatabase).toBeTruthy()
  })
})
