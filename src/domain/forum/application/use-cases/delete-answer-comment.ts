import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'

interface DeleteAnswerCommentUseCaseInput {
  answerCommentId: string
  authorId: string
}

export class DeleteAnswerCommentUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({ authorId, answerCommentId }: DeleteAnswerCommentUseCaseInput): Promise<void> {
    const answerComment = await this.answerCommentsRepository.findById(answerCommentId)

    if (!answerComment) {
      throw new Error('Answer comment not found.')
    }

    if (answerComment.authorId.value !== authorId) {
      throw new Error('Unauthorized.')
    }

    await this.answerCommentsRepository.delete(answerComment)
  }
}
