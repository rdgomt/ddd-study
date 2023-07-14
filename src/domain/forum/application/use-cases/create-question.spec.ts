import { InMemoryQuestionsRepository } from '@/test/repositories/inm-questions-repository'
import { CreateQuestionUseCase } from './create-question'

let questionsRepository: InMemoryQuestionsRepository
let createQuestionUseCase: CreateQuestionUseCase

describe('CreateQuestionUseCase', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    createQuestionUseCase = new CreateQuestionUseCase(questionsRepository)
  })

  it('should be able to create a question', async () => {
    const result = await createQuestionUseCase.execute({
      authorId: 'authorId',
      title: 'title',
      content: 'content',
    })

    expect(result.isRight()).toBe(true)
    expect(questionsRepository.items[0]).toEqual(result.value?.question)
  })
})
