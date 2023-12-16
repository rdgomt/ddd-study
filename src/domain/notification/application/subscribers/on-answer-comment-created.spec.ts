import { SpyInstance } from 'vitest'
import { OnAnswerCommentCreated } from '@/domain/notification/application/subscribers/on-answer-comment-created'
import { makeAnswer } from '@/tests/factories/make-answer'
import { makeAnswerComment } from '@/tests/factories/make-answer-comment'
import { InMemoryAnswerAttachmentsRepository } from '@/tests/repositories/inm-answer-attachments-repository'
import { InMemoryAnswerCommentsRepository } from '@/tests/repositories/inm-answer-comments-repository'
import { InMemoryAnswersRepository } from '@/tests/repositories/inm-answers-repository'
import { InMemoryNotificationsRepository } from '@/tests/repositories/inm-notifications-repository'
import { InMemoryStudentsRepository } from '@/tests/repositories/inm-students-repository'
import { waitFor } from '@/utils/fn/wait-for'
import {
  SendNotificationUseCase,
  SendNotificationUseCaseInput,
  SendNotificationUseCaseOutput,
} from '../use-cases/send-notification'

let studentsRepository: InMemoryStudentsRepository
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let answersRepository: InMemoryAnswersRepository
let answerCommentsRepository: InMemoryAnswerCommentsRepository
let notificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase
let sendNotificationSpy: SpyInstance<[SendNotificationUseCaseInput], SendNotificationUseCaseOutput>

describe('OnAnswerCommentCreated', () => {
  beforeEach(() => {
    studentsRepository = new InMemoryStudentsRepository()
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answersRepository = new InMemoryAnswersRepository(answerAttachmentsRepository)
    answerCommentsRepository = new InMemoryAnswerCommentsRepository(studentsRepository)
    notificationsRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(notificationsRepository)
    sendNotificationSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnAnswerCommentCreated(answersRepository, sendNotificationUseCase)
  })

  it('should send a notification when a answer comment is created', async () => {
    const answer = makeAnswer()
    const answerComment = makeAnswerComment({ answerId: answer.id })

    await answersRepository.create(answer)
    await answerCommentsRepository.create(answerComment)

    await waitFor(() => {
      expect(sendNotificationSpy).toHaveBeenCalled()
    })
  })
})
