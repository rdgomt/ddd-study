import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { InMemoryQuestionAttachmentsRepository } from '@/tests/repositories/inm-question-attachments-repository'
import { InMemoryQuestionsRepository } from '@/tests/repositories/inm-questions-repository'
import { CreateQuestionUseCase } from './create-question'

let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let questionsRepository: InMemoryQuestionsRepository
let createQuestionUseCase: CreateQuestionUseCase

describe('CreateQuestionUseCase', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionsRepository = new InMemoryQuestionsRepository(questionAttachmentsRepository)
    createQuestionUseCase = new CreateQuestionUseCase(questionsRepository)
  })

  it('should be able to create a question', async () => {
    const result = await createQuestionUseCase.execute({
      attachmentsIds: ['1', '2'],
      authorId: 'authorId',
      content: 'content',
      title: 'title',
    })

    expect(result.isRight()).toBe(true)
    expect(questionsRepository.items[0]).toEqual(result.value?.question)
    expect(questionsRepository.items[0]?.attachments.currentItems).toHaveLength(2)
  })

  it('should persist attachments when creating a new question', async () => {
    const result = await createQuestionUseCase.execute({
      attachmentsIds: ['1', '2'],
      authorId: '1',
      content: 'Conteúdo da pergunta',
      title: 'Nova pergunta',
    })

    expect(result.isRight()).toBe(true)

    expect(questionAttachmentsRepository.items).toHaveLength(2)

    expect(questionAttachmentsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityID('1'),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityID('1'),
        }),
      ]),
    )
  })
})
