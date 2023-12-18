import { expect } from 'vitest'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { makeQuestion } from '@/tests/factories/make-question'
import { makeQuestionAttachment } from '@/tests/factories/make-question-attachment'
import { InMemoryAttachmentsRepository } from '@/tests/repositories/inm-attachments-repository'
import { InMemoryQuestionAttachmentsRepository } from '@/tests/repositories/inm-question-attachments-repository'
import { InMemoryQuestionsRepository } from '@/tests/repositories/inm-questions-repository'
import { InMemoryStudentsRepository } from '@/tests/repositories/inm-students-repository'
import { EditQuestionUseCase } from './edit-question'

let studentsRepository: InMemoryStudentsRepository
let attachmentsRepository: InMemoryAttachmentsRepository
let questionsRepository: InMemoryQuestionsRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let editQuestionUseCase: EditQuestionUseCase

describe('EditQuestionUseCase', () => {
  beforeEach(() => {
    studentsRepository = new InMemoryStudentsRepository()
    attachmentsRepository = new InMemoryAttachmentsRepository()
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()

    questionsRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
      attachmentsRepository,
      studentsRepository,
    )

    editQuestionUseCase = new EditQuestionUseCase(questionsRepository, questionAttachmentsRepository)
  })

  it('should be able to edit a question', async () => {
    const newQuestion = makeQuestion()

    await questionsRepository.create(newQuestion)

    const newTitle = 'new-title'
    const newContent = 'new-content'

    questionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        attachmentId: new UniqueEntityID('1'),
        questionId: newQuestion.id,
      }),
      makeQuestionAttachment({
        attachmentId: new UniqueEntityID('2'),
        questionId: newQuestion.id,
      }),
    )

    const result = await editQuestionUseCase.execute({
      attachmentsIds: ['1', '3'],
      authorId: newQuestion.authorId.value,
      content: newContent,
      questionId: newQuestion.id.value,
      title: newTitle,
    })

    expect(result.isRight()).toBe(true)

    if (!result.isRight()) {
      return
    }

    expect(result.value.question).toMatchObject({
      content: newContent,
      title: newTitle,
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
      attachmentsIds: [],
      authorId: 'another-author',
      content: 'new-content',
      questionId: newQuestion.id.value,
      title: 'new-title',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should sync new and removed attachment when editing a question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )

    await questionsRepository.create(newQuestion)

    questionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        attachmentId: new UniqueEntityID('1'),
        questionId: newQuestion.id,
      }),
      makeQuestionAttachment({
        attachmentId: new UniqueEntityID('2'),
        questionId: newQuestion.id,
      }),
    )

    const result = await editQuestionUseCase.execute({
      attachmentsIds: ['1', '3'],
      authorId: 'author-1',
      content: 'Conteúdo teste',
      questionId: newQuestion.id.value,
      title: 'Pergunta teste',
    })

    expect(result.isRight()).toBe(true)
    expect(questionAttachmentsRepository.items).toHaveLength(2)

    expect(questionAttachmentsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityID('1'),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityID('3'),
        }),
      ]),
    )
  })
})
