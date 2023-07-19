import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Answer } from '../../enterprise/entities/answer'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { AnswerAttachmentsList } from '../../enterprise/entities/answer-attachment-list'
import { AnswerAttachmentsRepository } from '../repositories/answer-attachments-repository'
import { AnswersRepository } from '../repositories/answers-repository'

interface EditAnswerUseCaseInput {
  answerId: string
  attachmentsIds: string[]
  authorId: string
  content: string
}

type EditAnswerUseCaseOutput = Promise<
  Either<
    ResourceNotFoundError | NotAllowedError,
    {
      answer: Answer
    }
  >
>

export class EditAnswerUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async execute({ answerId, attachmentsIds, authorId, content }: EditAnswerUseCaseInput): EditAnswerUseCaseOutput {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== answer.authorId.value) {
      return left(new NotAllowedError())
    }

    const currentAnswerAttachments = await this.answerAttachmentsRepository.findManyByAnswerId(answerId)
    const answerAttachmentsList = new AnswerAttachmentsList(currentAnswerAttachments)

    const answerAttachments = attachmentsIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        answerId: answer.id,
      })
    })

    answerAttachmentsList.update(answerAttachments)

    answer.attachments = answerAttachmentsList
    answer.content = content

    await this.answersRepository.save(answer)

    return right({
      answer,
    })
  }
}
