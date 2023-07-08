import { makeAnswer } from '@/test/factories/make-answer'
import { InMemoryAnswersRepository } from '@/test/repositories/inm-answers-repository'
import { AnswersRepository } from '../repositories/answers-repository'
import { DeleteAnswerUseCase } from './delete-answer'

let answersRepository: AnswersRepository
let deleteAnswerUseCase: DeleteAnswerUseCase

describe('DeleteAnswerUseCase', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    deleteAnswerUseCase = new DeleteAnswerUseCase(answersRepository)
  })

  it('should be able to delete a answer', async () => {
    const answer = makeAnswer()

    await answersRepository.create(answer)

    await deleteAnswerUseCase.execute({
      authorId: answer.authorId.value,
      answerId: answer.id.value,
    })

    const result = await answersRepository.findById(answer.id.value)

    expect(result).toEqual(null)
  })

  it('should not be able to delete a answer from another author', async () => {
    const answer = makeAnswer()

    await answersRepository.create(answer)

    await expect(() => {
      return deleteAnswerUseCase.execute({
        authorId: 'another-author-id',
        answerId: answer.id.value,
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
