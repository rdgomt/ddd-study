import { makeQuestion } from '@/test/factories/make-question'
import { InMemoryQuestionsRepository } from '@/test/repositories/inm-questions-repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'

let questionsRepository: InMemoryQuestionsRepository
let getQuestionBySlugUseCase: GetQuestionBySlugUseCase

describe('GetQuestionBySlugUseCase', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    getQuestionBySlugUseCase = new GetQuestionBySlugUseCase(questionsRepository)
  })

  it('should be able to get a question by slug', async () => {
    const newQuestion = makeQuestion()

    await questionsRepository.create(newQuestion)

    const result = await getQuestionBySlugUseCase.execute({
      slug: newQuestion.slug.value,
    })

    expect(result.isRight()).toBe(true)

    if (!result.isRight()) {
      return
    }

    expect(result.value.question.id).toEqual(newQuestion.id)
    expect(result.value.question.slug).toEqual(newQuestion.slug)
  })
})
