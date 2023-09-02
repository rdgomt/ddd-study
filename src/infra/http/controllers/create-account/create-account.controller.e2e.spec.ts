import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'

describe('CreateAccountController', () => {
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

  it('should be able to create an user account', async () => {
    const email = faker.internet.email()

    const response = await request(app.getHttpServer()).post('/accounts').send({
      email,
      name: faker.person.fullName(),
      password: faker.internet.password(),
    })

    expect(response.statusCode).toBe(HttpStatus.CREATED)

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    expect(userOnDatabase).toBeTruthy()
  })
})
