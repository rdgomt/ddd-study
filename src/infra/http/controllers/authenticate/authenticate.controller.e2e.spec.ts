import { hash } from 'bcryptjs'
import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'

describe('AuthenticateController', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = testingModule.createNestApplication()
    prisma = testingModule.get(PrismaService)
    await app.init()
  })

  it('should be able to authenticate an user', async () => {
    const email = faker.internet.email()
    const name = faker.person.fullName()
    const password = faker.internet.password()

    await prisma.user.create({
      data: {
        email,
        name,
        password: await hash(password, 8),
      },
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email,
      password,
    })

    expect(response.statusCode).toBe(HttpStatus.CREATED)

    expect(response.body).toEqual({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      accessToken: expect.any(String),
    })
  })
})
