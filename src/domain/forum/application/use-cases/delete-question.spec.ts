import { makeQuestion } from '@/test/factories/make-question'
import { InMemoryQuestionsRepository } from '@/test/repositories/inm-questions-repository'
import { QuestionsRepository } from '../repositories/questions-repository'
import { DeleteQuestionUseCase } from './delete-question'

let questionsRepository: QuestionsRepository
let deleteQuestionUseCase: DeleteQuestionUseCase

describe('DeleteQuestionUseCase', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    deleteQuestionUseCase = new DeleteQuestionUseCase(questionsRepository)
  })

  it('should be able to delete a question', async () => {
    const question = makeQuestion()

    await questionsRepository.create(question)

    await deleteQuestionUseCase.execute({
      authorId: question.authorId.value,
      questionId: question.id.value,
    })

    const result = await questionsRepository.findById(question.id.value)

    expect(result).toEqual(null)
  })

  it('should not be able to delete a question from another author', async () => {
    const question = makeQuestion()

    await questionsRepository.create(question)

    await expect(() => {
      return deleteQuestionUseCase.execute({
        authorId: 'another-author-id',
        questionId: question.id.value,
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
