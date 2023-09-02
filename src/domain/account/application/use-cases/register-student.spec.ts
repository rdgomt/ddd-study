import { FakeHasher } from '@/tests/crypto/fake-hasher'
import { InMemoryStudentsRepository } from '@/tests/repositories/inm-students-repository'
import { faker } from '@faker-js/faker'
import { RegisterStudentUseCase } from './register-student'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let fakeHasher: FakeHasher
let registerStudent: RegisterStudentUseCase

describe('RegisterStudent', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    fakeHasher = new FakeHasher()
    registerStudent = new RegisterStudentUseCase(inMemoryStudentsRepository, fakeHasher)
  })

  it('should be able to register a new student', async () => {
    const result = await registerStudent.execute({
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
    })

    expect(result.isRight()).toBe(true)

    expect(result.value).toEqual({
      student: inMemoryStudentsRepository.items[0],
    })
  })

  it('should hash student password upon registration', async () => {
    const password = faker.internet.password()

    const result = await registerStudent.execute({
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password,
    })

    const hashedPassword = await fakeHasher.hash(password)

    expect(result.isRight()).toBe(true)
    expect(inMemoryStudentsRepository.items[0]?.password).toEqual(hashedPassword)
  })
})
