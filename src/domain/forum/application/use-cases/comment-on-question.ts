import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { Injectable } from '@nestjs/common'
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

@Injectable()
export class CommentOnQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private questionCommentsRepository: QuestionCommentsRepository,
  ) {}

  async execute({ authorId, content, questionId }: CommentOnQuestionUseCaseInput): CommentOnQuestionUseCaseOutput {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    const questionComment = QuestionComment.create({
      authorId: new UniqueEntityID(authorId),
      content,
      questionId: new UniqueEntityID(questionId),
    })

    await this.questionCommentsRepository.create(questionComment)

    return right({
      questionComment,
    })
  }
}
