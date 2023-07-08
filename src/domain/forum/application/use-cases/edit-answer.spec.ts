import { makeAnswer } from '@/test/factories/make-answer'
import { InMemoryAnswersRepository } from '@/test/repositories/inm-answers-repository'
import { EditAnswerUseCase } from './edit-answer'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let editAnswerUseCase: EditAnswerUseCase

describe('EditAnswerUseCase', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    editAnswerUseCase = new EditAnswerUseCase(inMemoryAnswersRepository)
  })

  it('should be able to edit a answer', async () => {
    const newAnswer = makeAnswer()

    await inMemoryAnswersRepository.create(newAnswer)

    const newContent = 'new-content'

    await editAnswerUseCase.execute({
      answerId: newAnswer.id.value,
      authorId: newAnswer.authorId.value,
      content: newContent,
    })

    expect(inMemoryAnswersRepository.answers[0]).toMatchObject({
      content: newContent,
    })
  })

  it('should not be able to edit a answer from another author', async () => {
    const newAnswer = makeAnswer()

    await inMemoryAnswersRepository.create(newAnswer)

    await expect(() => {
      return editAnswerUseCase.execute({
        answerId: newAnswer.id.value,
        authorId: 'another-author',
        content: 'new-content',
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
