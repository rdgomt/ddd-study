import { InMemoryQuestionsRepository } from '@/test/repositories/inm-questions-repository'
import { QuestionsRepository } from '../repositories/questions-repository'
import { CreateQuestionUseCase } from './create-question'

let questionsRepository: QuestionsRepository
let createQuestionUseCase: CreateQuestionUseCase

describe('CreateQuestionUseCase', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    createQuestionUseCase = new CreateQuestionUseCase(questionsRepository)
  })

  it('should be able to create a question', async () => {
    const { question } = await createQuestionUseCase.execute({
      authorId: 'authorId',
      title: 'title',
      content: 'content',
    })

    expect(question.id).toBeTruthy()
  })
})
