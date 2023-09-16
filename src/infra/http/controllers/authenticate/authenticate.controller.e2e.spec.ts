import { hash } from 'bcryptjs'
import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { StudentFactory } from '@/tests/factories/make-student'
import { faker } from '@faker-js/faker'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'

describe('AuthenticateController', () => {
  let app: INestApplication
  let studentFactory: StudentFactory

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory],
    }).compile()

    app = testingModule.createNestApplication()
    studentFactory = testingModule.get(StudentFactory)

    await app.init()
  })

  test('POST /sessions', async () => {
    const email = faker.internet.email()
    const password = faker.internet.password()

    await studentFactory.makePrismaStudent({
      email,
      password: await hash(password, 8),
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
