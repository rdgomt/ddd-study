import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { makeAnswer } from '@/test/factories/make-answer'
import { InMemoryAnswersRepository } from '@/test/repositories/inm-answers-repository'
import { DeleteAnswerUseCase } from './delete-answer'

let answersRepository: InMemoryAnswersRepository
let deleteAnswerUseCase: DeleteAnswerUseCase

describe('DeleteAnswerUseCase', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    deleteAnswerUseCase = new DeleteAnswerUseCase(answersRepository)
  })

  it('should be able to delete a answer', async () => {
    const answer = makeAnswer()

    await answersRepository.create(answer)

    const result = await deleteAnswerUseCase.execute({
      authorId: answer.authorId.value,
      answerId: answer.id.value,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toBe(null)
    expect(answersRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a answer from another author', async () => {
    const answer = makeAnswer()

    await answersRepository.create(answer)

    const result = await deleteAnswerUseCase.execute({
      authorId: 'another-author-id',
      answerId: answer.id.value,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
