import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { AttachmentFactory } from '@/tests/factories/make-attachment'
import { QuestionFactory } from '@/tests/factories/make-question'
import { QuestionAttachmentFactory } from '@/tests/factories/make-question-attachment'
import { StudentFactory } from '@/tests/factories/make-student'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

describe('GetQuestionBySlugController', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let attachmentFactory: AttachmentFactory
  let questionAttachmentFactory: QuestionAttachmentFactory
  let questionFactory: QuestionFactory
  let jwt: JwtService

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AttachmentFactory, QuestionAttachmentFactory],
    }).compile()

    app = testingModule.createNestApplication()
    studentFactory = testingModule.get(StudentFactory)
    attachmentFactory = testingModule.get(AttachmentFactory)
    questionAttachmentFactory = testingModule.get(QuestionAttachmentFactory)
    questionFactory = testingModule.get(QuestionFactory)
    jwt = testingModule.get(JwtService)

    await app.init()
  })

  test('GET /questions/:slug', async () => {
    const user = await studentFactory.makePrismaStudent()
    const accessToken = jwt.sign({ sub: user.id.value })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const attachment = await attachmentFactory.makePrismaAttachment()

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    })

    const response = await request(app.getHttpServer())
      .get(`/questions/${question.slug.value}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(HttpStatus.OK)

    expect(response.body).toEqual({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      question: expect.objectContaining({
        attachments: [
          expect.objectContaining({
            title: attachment.title,
          }),
        ],
        authorName: user.name,
        title: question.title,
      }),
    })
  })
})
