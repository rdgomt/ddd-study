import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { makeAnswer } from '@/test/factories/make-answer'
import { makeAnswerAttachment } from '@/test/factories/make-answer-attachment'
import { InMemoryAnswerAttachmentsRepository } from '@/test/repositories/inm-answer-attachments-repository'
import { InMemoryAnswersRepository } from '@/test/repositories/inm-answers-repository'
import { EditAnswerUseCase } from './edit-answer'

let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let answersRepository: InMemoryAnswersRepository
let editAnswerUseCase: EditAnswerUseCase

describe('EditAnswerUseCase', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answersRepository = new InMemoryAnswersRepository(answerAttachmentsRepository)
    editAnswerUseCase = new EditAnswerUseCase(answersRepository, answerAttachmentsRepository)
  })

  it('should be able to edit a answer', async () => {
    const newAnswer = makeAnswer()

    await answersRepository.create(newAnswer)

    answerAttachmentsRepository.items.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    )

    const newContent = 'new-content'

    const result = await editAnswerUseCase.execute({
      answerId: newAnswer.id.value,
      authorId: newAnswer.authorId.value,
      content: newContent,
      attachmentsIds: ['1', '3'],
    })

    expect(result.isRight()).toBe(true)

    if (!result.isRight()) {
      return
    }

    expect(result.value.answer).toMatchObject({
      content: newContent,
    })

    expect(answersRepository.items[0].attachments.currentItems).toHaveLength(2)

    expect(answersRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
    ])
  })

  it('should not be able to edit a answer from another author', async () => {
    const newAnswer = makeAnswer()

    await answersRepository.create(newAnswer)

    const result = await editAnswerUseCase.execute({
      answerId: newAnswer.id.value,
      authorId: 'another-author',
      content: 'new-content',
      attachmentsIds: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
