import { makeQuestion } from '@/test/factories/make-question'
import { InMemoryQuestionsRepository } from '@/test/repositories/inm-questions-repository'
import { EditQuestionUseCase } from './edit-question'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let editQuestionUseCase: EditQuestionUseCase

describe('EditQuestionUseCase', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    editQuestionUseCase = new EditQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to edit a question', async () => {
    const newQuestion = makeQuestion()

    await inMemoryQuestionsRepository.create(newQuestion)

    const newTitle = 'new-title'
    const newContent = 'new-content'

    await editQuestionUseCase.execute({
      questionId: newQuestion.id.value,
      authorId: newQuestion.authorId.value,
      title: newTitle,
      content: newContent,
    })

    expect(inMemoryQuestionsRepository.questions[0]).toMatchObject({
      title: newTitle,
      content: newContent,
    })
  })

  it('should not be able to edit a question from another author', async () => {
    const newQuestion = makeQuestion()

    await inMemoryQuestionsRepository.create(newQuestion)

    await expect(() => {
      return editQuestionUseCase.execute({
        questionId: newQuestion.id.value,
        authorId: 'another-author',
        title: 'new-title',
        content: 'new-content',
      })
    }).rejects.toBeInstanceOf(Error)
  })
})