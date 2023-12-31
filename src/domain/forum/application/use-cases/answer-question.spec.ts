import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { InMemoryAnswerAttachmentsRepository } from '@/tests/repositories/inm-answer-attachments-repository'
import { InMemoryAnswersRepository } from '@/tests/repositories/inm-answers-repository'
import { AnswerQuestionUseCase } from './answer-question'

let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let answersRepository: InMemoryAnswersRepository
let createAnswerUseCase: AnswerQuestionUseCase

describe('AnswerQuestionUseCase', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answersRepository = new InMemoryAnswersRepository(answerAttachmentsRepository)
    createAnswerUseCase = new AnswerQuestionUseCase(answersRepository)
  })

  it('should be able to answer a question', async () => {
    const result = await createAnswerUseCase.execute({
      attachmentsIds: ['1', '2'],
      authorId: 'authorId',
      content: 'content',
      questionId: 'questionId',
    })

    expect(result.isRight()).toBe(true)

    expect(answersRepository.items[0]).toEqual(result.value?.answer)

    expect(answersRepository.items[0]?.attachments.currentItems).toHaveLength(2)

    expect(answersRepository.items[0]?.attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
    ])
  })

  it('should persist attachments when creating a new answer', async () => {
    const result = await createAnswerUseCase.execute({
      attachmentsIds: ['1', '2'],
      authorId: '1',
      content: 'Conteúdo da resposta',
      questionId: '1',
    })

    expect(result.isRight()).toBe(true)

    expect(answerAttachmentsRepository.items).toHaveLength(2)

    expect(answerAttachmentsRepository.items).toEqual(
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
