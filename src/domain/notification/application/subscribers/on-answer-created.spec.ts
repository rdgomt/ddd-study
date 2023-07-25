import { SpyInstance } from 'vitest'
import { OnAnswerCreated } from '@/domain/notification/application/subscribers/on-answer-created'
import { makeAnswer } from '@/test/factories/make-answer'
import { makeQuestion } from '@/test/factories/make-question'
import { InMemoryAnswerAttachmentsRepository } from '@/test/repositories/inm-answer-attachments-repository'
import { InMemoryAnswersRepository } from '@/test/repositories/inm-answers-repository'
import { InMemoryNotificationsRepository } from '@/test/repositories/inm-notifications-repository'
import { InMemoryQuestionAttachmentsRepository } from '@/test/repositories/inm-question-attachments-repository'
import { InMemoryQuestionsRepository } from '@/test/repositories/inm-questions-repository'
import { waitFor } from '@/test/utils/wait-for'
import {
  SendNotificationUseCase,
  SendNotificationUseCaseInput,
  SendNotificationUseCaseOutput,
} from '../use-cases/send-notification'

let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let questionsRepository: InMemoryQuestionsRepository
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let answersRepository: InMemoryAnswersRepository
let notificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase
let sendNotificationSpy: SpyInstance<[SendNotificationUseCaseInput], SendNotificationUseCaseOutput>

describe('OnAnswerCreated', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionsRepository = new InMemoryQuestionsRepository(questionAttachmentsRepository)
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answersRepository = new InMemoryAnswersRepository(answerAttachmentsRepository)
    notificationsRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(notificationsRepository)
    sendNotificationSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnAnswerCreated(questionsRepository, sendNotificationUseCase)
  })

  it('should send a notification when an answer is created', async () => {
    const question = makeQuestion()
    const answer = makeAnswer({ questionId: question.id })

    await questionsRepository.create(question)
    await answersRepository.create(answer)

    await waitFor(() => {
      expect(sendNotificationSpy).toHaveBeenCalled()
    })
  })
})
