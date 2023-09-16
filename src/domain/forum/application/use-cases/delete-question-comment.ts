import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { Injectable } from '@nestjs/common'

interface DeleteQuestionCommentUseCaseInput {
  authorId: string
  questionCommentId: string
}

type DeleteQuestionCommentUseCaseOutput = Promise<Either<ResourceNotFoundError | NotAllowedError, null>>

@Injectable()
export class DeleteQuestionCommentUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({
    authorId,
    questionCommentId,
  }: DeleteQuestionCommentUseCaseInput): DeleteQuestionCommentUseCaseOutput {
    const questionComment = await this.questionCommentsRepository.findById(questionCommentId)

    if (!questionComment) {
      return left(new ResourceNotFoundError())
    }

    if (questionComment.authorId.value !== authorId) {
      return left(new NotAllowedError())
    }

    await this.questionCommentsRepository.delete(questionComment)

    return right(null)
  }
}
