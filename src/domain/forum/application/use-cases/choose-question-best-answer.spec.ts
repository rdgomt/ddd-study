import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { makeAnswer } from '@/test/factories/make-answer'
import { makeQuestion } from '@/test/factories/make-question'
import { InMemoryAnswersRepository } from '@/test/repositories/inm-answers-repository'
import { InMemoryQuestionsRepository } from '@/test/repositories/inm-questions-repository'
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer'

let answersRepository: InMemoryAnswersRepository
let questionsRepository: InMemoryQuestionsRepository
let chooseQuestionBestAnswerUseCase: ChooseQuestionBestAnswerUseCase

describe('ChooseQuestionBestAnswerUseCase', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    questionsRepository = new InMemoryQuestionsRepository()
    chooseQuestionBestAnswerUseCase = new ChooseQuestionBestAnswerUseCase(answersRepository, questionsRepository)
  })

  it('should be able to choose the question best answer', async () => {
    const question = makeQuestion()
    await questionsRepository.create(question)

    const answer = makeAnswer({ questionId: question.id })
    await answersRepository.create(answer)

    await chooseQuestionBestAnswerUseCase.execute({
      authorId: question.authorId.value,
      answerId: answer.id.value,
    })

    expect(questionsRepository.items[0].bestAnswerId).toEqual(answer.id)
  })

  it('should not be able to choose another user question best answer', async () => {
    const question = makeQuestion({ authorId: new UniqueEntityID('author-1') })
    await questionsRepository.create(question)

    const answer = makeAnswer({ questionId: question.id })
    await answersRepository.create(answer)

    await expect(() => {
      return chooseQuestionBestAnswerUseCase.execute({
        authorId: 'another-author',
        answerId: answer.id.value,
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
