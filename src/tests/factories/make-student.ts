import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { Student, StudentProps } from '@/domain/account/enterprise/entities/student'
import { faker } from '@faker-js/faker'

export function makeStudent(override?: Partial<StudentProps>, id?: UniqueEntityID) {
  return Student.create(
    {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )
}
