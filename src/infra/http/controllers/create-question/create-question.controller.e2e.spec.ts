import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { StudentFactory } from '@/tests/factories/make-student'
import { faker } from '@faker-js/faker'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

describe('CreateQuestionController', () => {
  let app: INestApplication
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let jwt: JwtService

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory],
    }).compile()

    app = testingModule.createNestApplication()
    prisma = testingModule.get(PrismaService)
    studentFactory = testingModule.get(StudentFactory)
    jwt = testingModule.get(JwtService)

    await app.init()
  })

  test('POST /questions', async () => {
    const user = await studentFactory.makePrismaStudent()
    const accessToken = jwt.sign({ sub: user.id.value })
    const title = faker.lorem.sentence()
    const content = faker.lorem.text()

    const response = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content,
        title,
      })

    expect(response.statusCode).toBe(HttpStatus.CREATED)

    const questionOnDatabase = await prisma.question.findFirst({
      where: {
        title,
      },
    })

    expect(questionOnDatabase).toBeTruthy()
  })
})
