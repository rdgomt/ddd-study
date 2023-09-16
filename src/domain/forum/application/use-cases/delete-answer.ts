import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { AnswersRepository } from '../repositories/answers-repository'

interface DeleteAnswerUseCaseInput {
  answerId: string
  authorId: string
}

type DeleteAnswerUseCaseOutput = Promise<Either<ResourceNotFoundError | NotAllowedError, null>>

@Injectable()
export class DeleteAnswerUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({ answerId, authorId }: DeleteAnswerUseCaseInput): DeleteAnswerUseCaseOutput {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== answer.authorId.value) {
      return left(new NotAllowedError())
    }

    await this.answersRepository.delete(answer)

    return right(null)
  }
}
