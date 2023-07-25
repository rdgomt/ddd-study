import { expect } from 'vitest'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { makeQuestion } from '@/test/factories/make-question'
import { makeQuestionAttachment } from '@/test/factories/make-question-attachment'
import { InMemoryQuestionAttachmentsRepository } from '@/test/repositories/inm-question-attachments-repository'
import { InMemoryQuestionsRepository } from '@/test/repositories/inm-questions-repository'
import { EditQuestionUseCase } from './edit-question'

let questionsRepository: InMemoryQuestionsRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let editQuestionUseCase: EditQuestionUseCase

describe('EditQuestionUseCase', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionsRepository = new InMemoryQuestionsRepository(questionAttachmentsRepository)
    editQuestionUseCase = new EditQuestionUseCase(questionsRepository, questionAttachmentsRepository)
  })

  it('should be able to edit a question', async () => {
    const newQuestion = makeQuestion()

    await questionsRepository.create(newQuestion)

    const newTitle = 'new-title'
    const newContent = 'new-content'

    questionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    )

    const result = await editQuestionUseCase.execute({
      questionId: newQuestion.id.value,
      authorId: newQuestion.authorId.value,
      title: newTitle,
      content: newContent,
      attachmentsIds: ['1', '3'],
    })

    expect(result.isRight()).toBe(true)

    if (!result.isRight()) {
      return
    }

    expect(result.value.question).toMatchObject({
      title: newTitle,
      content: newContent,
    })

    expect(questionsRepository.items[0]?.attachments.currentItems).toHaveLength(2)

    expect(questionsRepository.items[0]?.attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
    ])
  })

  it('should not be able to edit a question from another author', async () => {
    const newQuestion = makeQuestion()

    await questionsRepository.create(newQuestion)

    const result = await editQuestionUseCase.execute({
      questionId: newQuestion.id.value,
      authorId: 'another-author',
      title: 'new-title',
      content: 'new-content',
      attachmentsIds: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
