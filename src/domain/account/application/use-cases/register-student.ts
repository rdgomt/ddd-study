import { HashGenerator } from '@/core/crypto/hash-generator'
import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Student } from '../../enterprise/entities/student'
import { StudentAlreadyExistsError } from '../errors/student-already-exists-error'
import { StudentsRepository } from '../repositories/students-repository'

interface RegisterStudentUseCaseInput {
  email: string
  name: string
  password: string
}

type RegisterStudentUseCaseOutput = Promise<
  Either<
    StudentAlreadyExistsError,
    {
      student: Student
    }
  >
>

@Injectable()
export class RegisterStudentUseCase {
  constructor(private studentsRepository: StudentsRepository, private hashGenerator: HashGenerator) {}

  async execute({ email, name, password }: RegisterStudentUseCaseInput): RegisterStudentUseCaseOutput {
    const studentWithSameEmail = await this.studentsRepository.findByEmail(email)

    if (studentWithSameEmail) {
      return left(new StudentAlreadyExistsError(email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const student = Student.create({
      email,
      name,
      password: hashedPassword,
    })

    await this.studentsRepository.create(student)

    return right({
      student,
    })
  }
}
