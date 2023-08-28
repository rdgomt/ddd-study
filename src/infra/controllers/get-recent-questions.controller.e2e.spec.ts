import request from 'supertest'
import { faker } from '@faker-js/faker'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AppModule } from '../app.module'
import { PrismaService } from '../prisma/prisma.service'

describe('GetRecentQuestionsController', () => {
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

  it('should be able to get recent questions', async () => {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: faker.internet.password(),
      },
    })

    const accessToken = jwt.sign({ sub: user.id })

    await prisma.question.createMany({
      data: [
        {
          authorId: user.id,
          content: faker.lorem.text(),
          slug: 'question-01',
          title: 'Question 01',
        },
        {
          authorId: user.id,
          content: faker.lorem.text(),
          slug: 'question-02',
          title: 'Question 02',
        },
      ],
    })

    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(HttpStatus.OK)

    expect(response.body).toEqual({
      questions: [expect.objectContaining({ title: 'Question 01' }), expect.objectContaining({ title: 'Question 02' })],
    })
  })
})
