import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { QuestionsRepository } from '../repositories/questions-repository'

interface CommentOnQuestionUseCaseInput {
  authorId: string
  content: string
  questionId: string
}

type CommentOnQuestionUseCaseOutput = Promise<
  Either<
    ResourceNotFoundError,
    {
      questionComment: QuestionComment
    }
  >
>

export class CommentOnQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private questionCommentsRepository: QuestionCommentsRepository,
  ) {}

  async execute({ authorId, questionId, content }: CommentOnQuestionUseCaseInput): CommentOnQuestionUseCaseOutput {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    const questionComment = QuestionComment.create({
      authorId: new UniqueEntityID(authorId),
      questionId: new UniqueEntityID(questionId),
      content,
    })

    await this.questionCommentsRepository.create(questionComment)

    return right({
      questionComment,
    })
  }
}
