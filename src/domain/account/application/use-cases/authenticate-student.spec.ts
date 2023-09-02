import { FakeEncrypter } from '@/tests/crypto/fake-encrypter'
import { FakeHasher } from '@/tests/crypto/fake-hasher'
import { makeStudent } from '@/tests/factories/make-student'
import { InMemoryStudentsRepository } from '@/tests/repositories/inm-students-repository'
import { faker } from '@faker-js/faker'
import { AuthenticateStudentUseCase } from './authenticate-student'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let fakeHasher: FakeHasher
let encrypter: FakeEncrypter
let authenticateStudent: AuthenticateStudentUseCase

describe('AuthenticateStudent', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    fakeHasher = new FakeHasher()
    encrypter = new FakeEncrypter()
    authenticateStudent = new AuthenticateStudentUseCase(inMemoryStudentsRepository, fakeHasher, encrypter)
  })

  it('should be able to authenticate a student', async () => {
    const email = faker.internet.email()
    const password = faker.internet.password()

    const student = makeStudent({
      email,
      password: await fakeHasher.hash(password),
    })

    await inMemoryStudentsRepository.create(student)

    const result = await authenticateStudent.execute({
      email,
      password,
    })

    expect(result.isRight()).toBe(true)

    if (!result.isRight()) {
      return
    }

    expect(result.value.accessToken).toBeDefined()
  })
})
