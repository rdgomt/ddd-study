import { makeQuestion } from '@/tests/factories/make-question'
import { InMemoryAttachmentsRepository } from '@/tests/repositories/inm-attachments-repository'
import { InMemoryQuestionAttachmentsRepository } from '@/tests/repositories/inm-question-attachments-repository'
import { InMemoryQuestionsRepository } from '@/tests/repositories/inm-questions-repository'
import { InMemoryStudentsRepository } from '@/tests/repositories/inm-students-repository'
import { GetRecentQuestionsUseCase } from './get-recent-questions'

let studentsRepository: InMemoryStudentsRepository
let attachmentsRepository: InMemoryAttachmentsRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let questionsRepository: InMemoryQuestionsRepository
let getRecentQuestionsUseCase: GetRecentQuestionsUseCase

describe('GetRecentQuestionsUseCase', () => {
  beforeEach(() => {
    studentsRepository = new InMemoryStudentsRepository()
    attachmentsRepository = new InMemoryAttachmentsRepository()
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()

    questionsRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
      attachmentsRepository,
      studentsRepository,
    )

    getRecentQuestionsUseCase = new GetRecentQuestionsUseCase(questionsRepository)
  })

  it('should be able to get recent questions', async () => {
    await questionsRepository.create(makeQuestion({ createdAt: new Date(2020, 0, 20) }))
    await questionsRepository.create(makeQuestion({ createdAt: new Date(2020, 0, 18) }))
    await questionsRepository.create(makeQuestion({ createdAt: new Date(2020, 0, 23) }))

    const result = await getRecentQuestionsUseCase.execute({ page: 1 })

    expect(result.isRight()).toBe(true)

    expect(result.value?.questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2020, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2020, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2020, 0, 18) }),
    ])
  })

  it('should be able to get paginated recent questions', async () => {
    await Promise.all(
      Array.from({ length: 22 }).map(() => {
        return questionsRepository.create(makeQuestion())
      }),
    )

    const result = await getRecentQuestionsUseCase.execute({
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.questions).toHaveLength(2)
  })
})
