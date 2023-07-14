import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { makeAnswer } from '@/test/factories/make-answer'
import { InMemoryAnswersRepository } from '@/test/repositories/inm-answers-repository'
import { EditAnswerUseCase } from './edit-answer'

let answersRepository: InMemoryAnswersRepository
let editAnswerUseCase: EditAnswerUseCase

describe('EditAnswerUseCase', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    editAnswerUseCase = new EditAnswerUseCase(answersRepository)
  })

  it('should be able to edit a answer', async () => {
    const newAnswer = makeAnswer()

    await answersRepository.create(newAnswer)

    const newContent = 'new-content'

    const result = await editAnswerUseCase.execute({
      answerId: newAnswer.id.value,
      authorId: newAnswer.authorId.value,
      content: newContent,
    })

    expect(result.isRight()).toBe(true)

    if (!result.isRight()) {
      return
    }

    expect(result.value.answer).toMatchObject({
      content: newContent,
    })
  })

  it('should not be able to edit a answer from another author', async () => {
    const newAnswer = makeAnswer()

    await answersRepository.create(newAnswer)

    const result = await editAnswerUseCase.execute({
      answerId: newAnswer.id.value,
      authorId: 'another-author',
      content: 'new-content',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
