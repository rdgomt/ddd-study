import { expect } from 'vitest'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { makeQuestion } from '@/test/factories/make-question'
import { InMemoryQuestionsRepository } from '@/test/repositories/inm-questions-repository'
import { EditQuestionUseCase } from './edit-question'

let questionsRepository: InMemoryQuestionsRepository
let editQuestionUseCase: EditQuestionUseCase

describe('EditQuestionUseCase', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    editQuestionUseCase = new EditQuestionUseCase(questionsRepository)
  })

  it('should be able to edit a question', async () => {
    const newQuestion = makeQuestion()

    await questionsRepository.create(newQuestion)

    const newTitle = 'new-title'
    const newContent = 'new-content'

    const result = await editQuestionUseCase.execute({
      questionId: newQuestion.id.value,
      authorId: newQuestion.authorId.value,
      title: newTitle,
      content: newContent,
    })

    expect(result.isRight()).toBe(true)

    if (!result.isRight()) {
      return
    }

    expect(result.value.question).toMatchObject({
      title: newTitle,
      content: newContent,
    })
  })

  it('should not be able to edit a question from another author', async () => {
    const newQuestion = makeQuestion()

    await questionsRepository.create(newQuestion)

    const result = await editQuestionUseCase.execute({
      questionId: newQuestion.id.value,
      authorId: 'another-author',
      title: 'new-title',
      content: 'new-content',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
