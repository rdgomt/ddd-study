import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { AttachmentFactory } from '@/tests/factories/make-attachment'
import { QuestionFactory } from '@/tests/factories/make-question'
import { QuestionAttachmentFactory } from '@/tests/factories/make-question-attachment'
import { StudentFactory } from '@/tests/factories/make-student'
import { faker } from '@faker-js/faker'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { EditQuestionDTO } from './edit-question.dto'

describe('EditQuestionController', () => {
  let app: INestApplication
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let attachmentFactory: AttachmentFactory
  let questionAttachmentFactory: QuestionAttachmentFactory
  let jwt: JwtService

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AttachmentFactory, QuestionAttachmentFactory],
    }).compile()

    app = testingModule.createNestApplication()
    prisma = testingModule.get(PrismaService)
    studentFactory = testingModule.get(StudentFactory)
    questionFactory = testingModule.get(QuestionFactory)
    attachmentFactory = testingModule.get(AttachmentFactory)
    questionAttachmentFactory = testingModule.get(QuestionAttachmentFactory)
    jwt = testingModule.get(JwtService)

    await app.init()
  })

  test('PUT /questions/:questionId', async () => {
    const user = await studentFactory.makePrismaStudent()
    const accessToken = jwt.sign({ sub: user.id.value })
    const title = faker.lorem.sentence()
    const content = faker.lorem.text()
    const attachment1 = await attachmentFactory.makePrismaAttachment()
    const attachment2 = await attachmentFactory.makePrismaAttachment()

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment1.id,
      questionId: question.id,
    })

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment2.id,
      questionId: question.id,
    })

    const attachment3 = await attachmentFactory.makePrismaAttachment()

    const editQuestionDTO: EditQuestionDTO = {
      attachmentsIds: [attachment1.id.value, attachment3.id.value],
      content,
      title,
    }

    const response = await request(app.getHttpServer())
      .put(`/questions/${question.id.value}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(editQuestionDTO)

    expect(response.statusCode).toBe(HttpStatus.NO_CONTENT)

    const questionOnDatabase = await prisma.question.findFirst({
      where: {
        content,
        title,
      },
    })

    expect(questionOnDatabase).toBeTruthy()

    const attachmentsOnDatabase = await prisma.attachment.findMany({
      where: {
        questionId: questionOnDatabase?.id,
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
