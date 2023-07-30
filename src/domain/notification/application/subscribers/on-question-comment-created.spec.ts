import { SpyInstance } from 'vitest'
import { OnQuestionCommentCreated } from '@/domain/notification/application/subscribers/on-question-comment-created'
import { makeQuestion } from '@/test/factories/make-question'
import { makeQuestionComment } from '@/test/factories/make-question-comment'
import { InMemoryNotificationsRepository } from '@/test/repositories/inm-notifications-repository'
import { InMemoryQuestionAttachmentsRepository } from '@/test/repositories/inm-question-attachments-repository'
import { InMemoryQuestionCommentsRepository } from '@/test/repositories/inm-question-comments-repository'
import { InMemoryQuestionsRepository } from '@/test/repositories/inm-questions-repository'
import { waitFor } from '@/test/utils/wait-for'
import {
  SendNotificationUseCase,
  SendNotificationUseCaseInput,
  SendNotificationUseCaseOutput,
} from '../use-cases/send-notification'

let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let questionsRepository: InMemoryQuestionsRepository
let questionCommentsRepository: InMemoryQuestionCommentsRepository
let notificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase
let sendNotificationSpy: SpyInstance<[SendNotificationUseCaseInput], SendNotificationUseCaseOutput>

describe('OnQuestionCommentCreated', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionsRepository = new InMemoryQuestionsRepository(questionAttachmentsRepository)
    questionCommentsRepository = new InMemoryQuestionCommentsRepository()
    notificationsRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(notificationsRepository)
    sendNotificationSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnQuestionCommentCreated(questionsRepository, sendNotificationUseCase)
  })

  it('should send a notification when a question comment is created', async () => {
    const question = makeQuestion()
    const questionComment = makeQuestionComment({ questionId: question.id })

    await questionsRepository.create(question)
    await questionCommentsRepository.create(questionComment)

    console.log('question', question)
    console.log('questionComment', questionComment)

    await waitFor(() => {
      expect(sendNotificationSpy).toHaveBeenCalled()
    })
  })
})
