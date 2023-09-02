import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { Student } from '@/domain/account/enterprise/entities/student'
import { Prisma, User as PrismaUser } from '@prisma/client'

export class PrismaStudentMapper {
  static toDomain(user: PrismaUser): Student {
    return Student.create(
      {
        email: user.email,
        name: user.name,
        password: user.password,
      },
      new UniqueEntityID(user.id),
    )
  }

  static toPrisma(student: Student): Prisma.UserUncheckedCreateInput {
    return {
      email: student.email,
      id: student.id.value,
      name: student.name,
      password: student.password,
    }
  }
}
