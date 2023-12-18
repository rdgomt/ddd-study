import { SpyInstance } from 'vitest'
import { OnQuestionCommentCreated } from '@/domain/notification/application/subscribers/on-question-comment-created'
import { makeQuestion } from '@/tests/factories/make-question'
import { makeQuestionComment } from '@/tests/factories/make-question-comment'
import { InMemoryAttachmentsRepository } from '@/tests/repositories/inm-attachments-repository'
import { InMemoryNotificationsRepository } from '@/tests/repositories/inm-notifications-repository'
import { InMemoryQuestionAttachmentsRepository } from '@/tests/repositories/inm-question-attachments-repository'
import { InMemoryQuestionCommentsRepository } from '@/tests/repositories/inm-question-comments-repository'
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
let questionCommentsRepository: InMemoryQuestionCommentsRepository
let notificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase
let sendNotificationSpy: SpyInstance<[SendNotificationUseCaseInput], SendNotificationUseCaseOutput>

describe('OnQuestionCommentCreated', () => {
  beforeEach(() => {
    studentsRepository = new InMemoryStudentsRepository()
    attachmentsRepository = new InMemoryAttachmentsRepository()
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()

    questionsRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
      attachmentsRepository,
      studentsRepository,
    )

    questionCommentsRepository = new InMemoryQuestionCommentsRepository(studentsRepository)
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

    await waitFor(() => {
      expect(sendNotificationSpy).toHaveBeenCalled()
    })
  })
})
