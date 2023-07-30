import { makeQuestion } from '@/tests/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from '@/tests/repositories/inm-question-attachments-repository'
import { InMemoryQuestionsRepository } from '@/tests/repositories/inm-questions-repository'
import { GetRecentQuestionsUseCase } from './get-recent-questions'

let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let questionsRepository: InMemoryQuestionsRepository
let getRecentQuestionsUseCase: GetRecentQuestionsUseCase

describe('GetRecentQuestionsUseCase', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionsRepository = new InMemoryQuestionsRepository(questionAttachmentsRepository)
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
