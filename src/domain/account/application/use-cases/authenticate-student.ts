import { Encrypter } from '@/core/crypto/encrypter'
import { HashComparer } from '@/core/crypto/hash-comparer'
import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { WrongCredentialsError } from '../errors/wrong-credentials-error'
import { StudentsRepository } from '../repositories/students-repository'

interface AuthenticateStudentUseCaseInput {
  email: string
  password: string
}

type AuthenticateStudentUseCaseOutput = Promise<
  Either<
    WrongCredentialsError,
    {
      accessToken: string
    }
  >
>

@Injectable()
export class AuthenticateStudentUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({ email, password }: AuthenticateStudentUseCaseInput): AuthenticateStudentUseCaseOutput {
    const student = await this.studentsRepository.findByEmail(email)

    if (!student) {
      return left(new WrongCredentialsError())
    }

    const isPasswordValid = await this.hashComparer.compare(password, student.password)

    if (!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: student.id.value,
    })

    return right({
      accessToken,
    })
  }
}
