import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'

interface DeleteAnswerCommentUseCaseInput {
  answerCommentId: string
  authorId: string
}

type DeleteAnswerCommentUseCaseOutput = Promise<Either<ResourceNotFoundError | NotAllowedError, null>>

export class DeleteAnswerCommentUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({ answerCommentId, authorId }: DeleteAnswerCommentUseCaseInput): DeleteAnswerCommentUseCaseOutput {
    const answerComment = await this.answerCommentsRepository.findById(answerCommentId)

    if (!answerComment) {
      return left(new ResourceNotFoundError())
    }

    if (answerComment.authorId.value !== authorId) {
      return left(new NotAllowedError())
    }

    await this.answerCommentsRepository.delete(answerComment)

    return right(null)
  }
}
