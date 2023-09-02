import { Either, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { Injectable } from '@nestjs/common'
import { Question } from '../../enterprise/entities/question'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { QuestionAttachmentsList } from '../../enterprise/entities/question-attachments-list'
import { QuestionsRepository } from '../repositories/questions-repository'

interface CreateQuestionUseCaseInput {
  attachmentsIds?: string[]
  authorId: string
  content: string
  title: string
}

type CreateQuestionUseCaseOutput = Promise<
  Either<
    void,
    {
      question: Question
    }
  >
>

@Injectable()
export class CreateQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    attachmentsIds = [],
    authorId,
    content,
    title,
  }: CreateQuestionUseCaseInput): CreateQuestionUseCaseOutput {
    const question = Question.create({
      authorId: new UniqueEntityID(authorId),
      content,
      title,
    })

    const questionAttachments = attachmentsIds.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        questionId: question.id,
      })
    })

    question.attachments = new QuestionAttachmentsList(questionAttachments)

    await this.questionsRepository.create(question)

    return right({
      question,
    })
  }
}
