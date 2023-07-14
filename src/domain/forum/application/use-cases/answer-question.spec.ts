import { InMemoryAnswersRepository } from '@/test/repositories/inm-answers-repository'
import { AnswerQuestionUseCase } from './answer-question'

let answersRepository: InMemoryAnswersRepository
let createAnswerUseCase: AnswerQuestionUseCase

describe('AnswerQuestionUseCase', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    createAnswerUseCase = new AnswerQuestionUseCase(answersRepository)
  })

  it('should be able to answer a question', async () => {
    const result = await createAnswerUseCase.execute({
      questionId: 'questionId',
      instructorId: 'instructorId',
      content: 'content',
    })

    expect(result.isRight()).toBe(true)
    expect(answersRepository.items[0]).toEqual(result.value?.answer)
  })
})
