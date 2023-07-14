import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { makeQuestion } from '@/test/factories/make-question'
import { InMemoryQuestionsRepository } from '@/test/repositories/inm-questions-repository'
import { DeleteQuestionUseCase } from './delete-question'

let questionsRepository: InMemoryQuestionsRepository
let deleteQuestionUseCase: DeleteQuestionUseCase

describe('DeleteQuestionUseCase', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    deleteQuestionUseCase = new DeleteQuestionUseCase(questionsRepository)
  })

  it('should be able to delete a question', async () => {
    const question = makeQuestion()

    await questionsRepository.create(question)

    const result = await deleteQuestionUseCase.execute({
      authorId: question.authorId.value,
      questionId: question.id.value,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toBe(null)
    expect(questionsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a question from another author', async () => {
    const question = makeQuestion()

    await questionsRepository.create(question)

    const result = await deleteQuestionUseCase.execute({
      authorId: 'another-author-id',
      questionId: question.id.value,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
