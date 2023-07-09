/* eslint-disable no-magic-numbers */
import { makeQuestion } from '@/test/factories/make-question'
import { InMemoryQuestionsRepository } from '@/test/repositories/inm-questions-repository'
import { QuestionsRepository } from '../repositories/questions-repository'
import { GetRecentQuestionsUseCase } from './get-recent-questions'

let questionsRepository: QuestionsRepository
let getRecentQuestionsUseCase: GetRecentQuestionsUseCase

describe('GetRecentQuestionsUseCase', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    getRecentQuestionsUseCase = new GetRecentQuestionsUseCase(questionsRepository)
  })

  it('should be able to get recent questions', async () => {
    await questionsRepository.create(makeQuestion({ createdAt: new Date(2020, 0, 20) }))
    await questionsRepository.create(makeQuestion({ createdAt: new Date(2020, 0, 18) }))
    await questionsRepository.create(makeQuestion({ createdAt: new Date(2020, 0, 23) }))

    const { questions } = await getRecentQuestionsUseCase.execute({ page: 1 })

    expect(questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2020, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2020, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2020, 0, 18) }),
    ])
  })
})
