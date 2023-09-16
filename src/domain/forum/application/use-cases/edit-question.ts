import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { Question } from '../../enterprise/entities/question'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { QuestionAttachmentsList } from '../../enterprise/entities/question-attachments-list'
import { QuestionAttachmentsRepository } from '../repositories/question-attachments-repository'
import { QuestionsRepository } from '../repositories/questions-repository'

interface EditQuestionUseCaseInput {
  attachmentsIds: string[]
  authorId: string
  content: string
  questionId: string
  title: string
}

type EditQuestionUseCaseOutput = Promise<
  Either<
    ResourceNotFoundError | NotAllowedError,
    {
      question: Question
    }
  >
>

@Injectable()
export class EditQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async execute({
    attachmentsIds,
    authorId,
    content,
    questionId,
    title,
  }: EditQuestionUseCaseInput): EditQuestionUseCaseOutput {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== question.authorId.value) {
      return left(new NotAllowedError())
    }

    const currentQuestionAttachments = await this.questionAttachmentsRepository.findManyByQuestionId(questionId)
    const questionAttachmentsList = new QuestionAttachmentsList(currentQuestionAttachments)

    const questionAttachments = attachmentsIds.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        questionId: question.id,
      })
    })

    questionAttachmentsList.update(questionAttachments)

    question.attachments = questionAttachmentsList
    question.content = content
    question.title = title

    await this.questionsRepository.save(question)

    return right({
      question,
    })
  }
}
