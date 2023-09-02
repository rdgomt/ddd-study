import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

describe('CreateQuestionController', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = testingModule.createNestApplication()
    prisma = testingModule.get(PrismaService)
    jwt = testingModule.get(JwtService)

    await app.init()
  })

  it('should be able to create a question', async () => {
    const title = faker.lorem.sentence()
    const content = faker.lorem.text()

    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: faker.internet.password(),
      },
    })

    const accessToken = jwt.sign({ sub: user.id })

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
