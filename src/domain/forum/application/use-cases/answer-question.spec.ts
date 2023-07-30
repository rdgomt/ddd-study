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
      content: 'content',
      instructorId: 'instructorId',
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
})
