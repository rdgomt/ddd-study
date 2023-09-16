import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { QuestionsRepository } from '../repositories/questions-repository'

interface DeleteQuestionUseCaseInput {
  authorId: string
  questionId: string
}

type DeleteQuestionUseCaseOutput = Promise<Either<ResourceNotFoundError | NotAllowedError, null>>

@Injectable()
export class DeleteQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({ authorId, questionId }: DeleteQuestionUseCaseInput): DeleteQuestionUseCaseOutput {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== question.authorId.value) {
      return left(new NotAllowedError())
    }

    await this.questionsRepository.delete(question)

    return right(null)
  }
}
