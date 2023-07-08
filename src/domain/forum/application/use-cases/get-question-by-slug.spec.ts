import { makeQuestion } from '@/test/factories/make-question'
import { InMemoryQuestionsRepository } from '@/test/repositories/inm-questions-repository'
import { QuestionsRepository } from '../repositories/questions-repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'

let questionsRepository: QuestionsRepository
let getQuestionBySlugUseCase: GetQuestionBySlugUseCase

describe('GetQuestionBySlugUseCase', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    getQuestionBySlugUseCase = new GetQuestionBySlugUseCase(questionsRepository)
  })

  it('should be able to get a question by slug', async () => {
    const newQuestion = makeQuestion()

    await questionsRepository.create(newQuestion)

    const { question } = await getQuestionBySlugUseCase.execute({
      slug: newQuestion.slug.value,
    })

    expect(question.id).toEqual(newQuestion.id)
    expect(question.slug).toEqual(newQuestion.slug)
  })
})
