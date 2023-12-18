import { StudentsRepository } from '@/domain/account/application/repositories/students-repository'
import { Student } from '@/domain/account/enterprise/entities/student'
import { AsyncNullable } from '@/utils/typescript/types'
import { Injectable } from '@nestjs/common'
import { PrismaStudentMapper } from '../mappers/prisma-student-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaStudentsRepository implements StudentsRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): AsyncNullable<Student> {
    const student = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!student) {
      return null
    }

    return PrismaStudentMapper.toDomain(student)
  }

  async create(student: Student): Promise<void> {
    const data = PrismaStudentMapper.toPrisma(student)

    await this.prisma.user.create({
      data,
    })
  }
}
