import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'

interface DeleteQuestionCommentUseCaseInput {
  authorId: string
  questionCommentId: string
}

export class DeleteQuestionCommentUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({ authorId, questionCommentId }: DeleteQuestionCommentUseCaseInput): Promise<void> {
    const questionComment = await this.questionCommentsRepository.findById(questionCommentId)

    if (!questionComment) {
      throw new Error('Question comment not found.')
    }

    if (questionComment.authorId.value !== authorId) {
      throw new Error('Unauthorized.')
    }

    await this.questionCommentsRepository.delete(questionComment)
  }
}
