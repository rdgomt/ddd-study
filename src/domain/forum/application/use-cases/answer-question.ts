import { Either, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { Answer } from '../../enterprise/entities/answer'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { AnswerAttachmentsList } from '../../enterprise/entities/answer-attachment-list'
import { AnswersRepository } from '../repositories/answers-repository'

interface AnswerQuestionUseCaseInput {
  attachmentsIds: string[]
  content: string
  instructorId: string
  questionId: string
}

type AnswerQuestionUseCaseOutput = Promise<
  Either<
    void,
    {
      answer: Answer
    }
  >
>

export class AnswerQuestionUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    attachmentsIds,
    content,
    instructorId,
    questionId,
  }: AnswerQuestionUseCaseInput): AnswerQuestionUseCaseOutput {
    const answer = Answer.create({
      authorId: new UniqueEntityID(instructorId),
      content,
      questionId: new UniqueEntityID(questionId),
    })

    const answerAttachments = attachmentsIds.map((attachmentId) => {
      return AnswerAttachment.create({
        answerId: answer.id,
        attachmentId: new UniqueEntityID(attachmentId),
      })
    })

    answer.attachments = new AnswerAttachmentsList(answerAttachments)

    await this.answersRepository.create(answer)

    return right({
      answer,
    })
  }
}
