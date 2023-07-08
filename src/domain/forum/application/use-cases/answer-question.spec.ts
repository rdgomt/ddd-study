import { InMemoryAnswersRepository } from '@/test/repositories/inm-answers-repository'
import { AnswersRepository } from '../repositories/answers-repository'
import { AnswerQuestionUseCase } from './answer-question'

let answersRepository: AnswersRepository
let createAnswerUseCase: AnswerQuestionUseCase

describe('AnswerQuestionUseCase', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    createAnswerUseCase = new AnswerQuestionUseCase(answersRepository)
  })

  it('should be able to answer a question', async () => {
    const { answer } = await createAnswerUseCase.execute({
      questionId: 'questionId',
      instructorId: 'instructorId',
      content: 'content',
    })

    expect(answer.id).toBeTruthy()
  })
})
