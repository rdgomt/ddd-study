import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { AttachmentFactory } from '@/tests/factories/make-attachment'
import { StudentFactory } from '@/tests/factories/make-student'
import { faker } from '@faker-js/faker'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { CreateQuestionDTO } from './create-question.dto'

describe('CreateQuestionController', () => {
  let app: INestApplication
  let prisma: PrismaService
  let attachmentFactory: AttachmentFactory
  let studentFactory: StudentFactory
  let jwt: JwtService

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, AttachmentFactory],
    }).compile()

    app = testingModule.createNestApplication()
    prisma = testingModule.get(PrismaService)
    attachmentFactory = testingModule.get(AttachmentFactory)
    studentFactory = testingModule.get(StudentFactory)
    jwt = testingModule.get(JwtService)

    await app.init()
  })

  test('POST /questions', async () => {
    const user = await studentFactory.makePrismaStudent()
    const accessToken = jwt.sign({ sub: user.id.value })
    const title = faker.lorem.sentence()
    const content = faker.lorem.text()
    const attachment1 = await attachmentFactory.makePrismaAttachment()
    const attachment2 = await attachmentFactory.makePrismaAttachment()

    const createQuestionDTO: CreateQuestionDTO = {
      attachmentsIds: [attachment1.id.value, attachment2.id.value],
      content,
      title,
    }

    const response = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(createQuestionDTO)

    expect(response.statusCode).toBe(HttpStatus.CREATED)

    const questionOnDatabase = await prisma.question.findFirst({
      where: {
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
  })
})
