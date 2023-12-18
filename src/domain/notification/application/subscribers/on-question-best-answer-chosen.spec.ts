import { SpyInstance } from 'vitest'
import { OnQuestionBestAnswerChosen } from '@/domain/notification/application/subscribers/on-question-best-answer-chosen'
import { makeAnswer } from '@/tests/factories/make-answer'
import { makeQuestion } from '@/tests/factories/make-question'
import { InMemoryAnswerAttachmentsRepository } from '@/tests/repositories/inm-answer-attachments-repository'
import { InMemoryAnswersRepository } from '@/tests/repositories/inm-answers-repository'
import { InMemoryAttachmentsRepository } from '@/tests/repositories/inm-attachments-repository'
import { InMemoryNotificationsRepository } from '@/tests/repositories/inm-notifications-repository'
import { InMemoryQuestionAttachmentsRepository } from '@/tests/repositories/inm-question-attachments-repository'
import { InMemoryQuestionsRepository } from '@/tests/repositories/inm-questions-repository'
import { InMemoryStudentsRepository } from '@/tests/repositories/inm-students-repository'
import { waitFor } from '@/utils/fn/wait-for'
import {
  SendNotificationUseCase,
  SendNotificationUseCaseInput,
  SendNotificationUseCaseOutput,
} from '../use-cases/send-notification'

let studentsRepository: InMemoryStudentsRepository
let attachmentsRepository: InMemoryAttachmentsRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let questionsRepository: InMemoryQuestionsRepository
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let answersRepository: InMemoryAnswersRepository
let notificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase
let sendNotificationSpy: SpyInstance<[SendNotificationUseCaseInput], SendNotificationUseCaseOutput>

describe('OnQuestionBestAnswerChosen', () => {
  beforeEach(() => {
    studentsRepository = new InMemoryStudentsRepository()
    attachmentsRepository = new InMemoryAttachmentsRepository()
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()

    questionsRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
      attachmentsRepository,
      studentsRepository,
    )

    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answersRepository = new InMemoryAnswersRepository(answerAttachmentsRepository)
    notificationsRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(notificationsRepository)
    sendNotificationSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnQuestionBestAnswerChosen(answersRepository, sendNotificationUseCase)
  })

  it('should send a notification when a question gets a new best answer', async () => {
    const question = makeQuestion()
    const answer = makeAnswer({ questionId: question.id })

    await questionsRepository.create(question)
    await answersRepository.create(answer)

    question.bestAnswerId = answer.id

    await questionsRepository.save(question)

    await waitFor(() => {
      expect(sendNotificationSpy).toHaveBeenCalled()
    })
  })
})
