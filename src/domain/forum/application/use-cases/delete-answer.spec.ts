import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { makeAnswer } from '@/tests/factories/make-answer'
import { makeAnswerAttachment } from '@/tests/factories/make-answer-attachment'
import { InMemoryAnswerAttachmentsRepository } from '@/tests/repositories/inm-answer-attachments-repository'
import { InMemoryAnswersRepository } from '@/tests/repositories/inm-answers-repository'
import { DeleteAnswerUseCase } from './delete-answer'

let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let answersRepository: InMemoryAnswersRepository
let deleteAnswerUseCase: DeleteAnswerUseCase

describe('DeleteAnswerUseCase', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answersRepository = new InMemoryAnswersRepository(answerAttachmentsRepository)
    deleteAnswerUseCase = new DeleteAnswerUseCase(answersRepository)
  })

  it('should be able to delete a answer', async () => {
    const answer = makeAnswer()

    await answersRepository.create(answer)

    answerAttachmentsRepository.items.push(
      makeAnswerAttachment({
        answerId: answer.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      makeAnswerAttachment({
        answerId: answer.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    )

    const result = await deleteAnswerUseCase.execute({
      answerId: answer.id.value,
      authorId: answer.authorId.value,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toBe(null)
    expect(answersRepository.items).toHaveLength(0)
    expect(answerAttachmentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a answer from another author', async () => {
    const answer = makeAnswer()

    await answersRepository.create(answer)

    const result = await deleteAnswerUseCase.execute({
      answerId: answer.id.value,
      authorId: 'another-author-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
