import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { AnswerFactory } from '@/tests/factories/make-answer'
import { AnswerAttachmentFactory } from '@/tests/factories/make-answer-attachment'
import { AttachmentFactory } from '@/tests/factories/make-attachment'
import { QuestionFactory } from '@/tests/factories/make-question'
import { StudentFactory } from '@/tests/factories/make-student'
import { faker } from '@faker-js/faker'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AnswerQuestionDTO } from '../answer-question/answer-question.dto'

describe('EditAnswerController', () => {
  let app: INestApplication
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory
  let attachmentFactory: AttachmentFactory
  let answerAttachmentFactory: AnswerAttachmentFactory
  let jwt: JwtService

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory, AttachmentFactory, AnswerAttachmentFactory],
    }).compile()

    app = testingModule.createNestApplication()
    prisma = testingModule.get(PrismaService)
    studentFactory = testingModule.get(StudentFactory)
    questionFactory = testingModule.get(QuestionFactory)
    answerFactory = testingModule.get(AnswerFactory)
    attachmentFactory = testingModule.get(AttachmentFactory)
    answerAttachmentFactory = testingModule.get(AnswerAttachmentFactory)
    jwt = testingModule.get(JwtService)

    await app.init()
  })

  test('PUT /answers/:answerId', async () => {
    const user = await studentFactory.makePrismaStudent()
    const accessToken = jwt.sign({ sub: user.id.value })
    const attachment1 = await attachmentFactory.makePrismaAttachment()
    const attachment2 = await attachmentFactory.makePrismaAttachment()
    const content = faker.lorem.paragraphs(2)

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const answer = await answerFactory.makePrismaAnswer({
      authorId: user.id,
      questionId: question.id,
    })

    await answerAttachmentFactory.makePrismaAnswerAttachment({
      answerId: answer.id,
      attachmentId: attachment1.id,
    })

    await answerAttachmentFactory.makePrismaAnswerAttachment({
      answerId: answer.id,
      attachmentId: attachment2.id,
    })

    const attachment3 = await attachmentFactory.makePrismaAttachment()
    const answerId = answer.id.value

    const answerQuestionDTO: AnswerQuestionDTO = {
      attachmentsIds: [attachment1.id.value, attachment3.id.value],
      content,
    }

    const response = await request(app.getHttpServer())
      .put(`/answers/${answerId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(answerQuestionDTO)

    expect(response.statusCode).toBe(HttpStatus.NO_CONTENT)

    const answerOnDatabase = await prisma.answer.findFirst({
      where: {
        content,
      },
    })

    expect(answerOnDatabase).toBeTruthy()

    const attachmentsOnDatabase = await prisma.attachment.findMany({
      where: {
        answerId: answerOnDatabase?.id,
      },
    })

    expect(attachmentsOnDatabase).toHaveLength(2)

    expect(attachmentsOnDatabase).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: attachment1.id.value,
        }),
        expect.objectContaining({
          id: attachment3.id.value,
        }),
      ]),
    )
  })
})
