import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { makeAnswer } from '@/tests/factories/make-answer'
import { makeQuestion } from '@/tests/factories/make-question'
import { InMemoryAnswerAttachmentsRepository } from '@/tests/repositories/inm-answer-attachments-repository'
import { InMemoryAnswersRepository } from '@/tests/repositories/inm-answers-repository'
import { InMemoryQuestionAttachmentsRepository } from '@/tests/repositories/inm-question-attachments-repository'
import { InMemoryQuestionsRepository } from '@/tests/repositories/inm-questions-repository'
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer'

let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let answersRepository: InMemoryAnswersRepository
let questionsRepository: InMemoryQuestionsRepository
let chooseQuestionBestAnswerUseCase: ChooseQuestionBestAnswerUseCase

describe('ChooseQuestionBestAnswerUseCase', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionsRepository = new InMemoryQuestionsRepository(questionAttachmentsRepository)
    answersRepository = new InMemoryAnswersRepository(answerAttachmentsRepository)
    chooseQuestionBestAnswerUseCase = new ChooseQuestionBestAnswerUseCase(answersRepository, questionsRepository)
  })

  it('should be able to choose the question best answer', async () => {
    const question = makeQuestion()
    await questionsRepository.create(question)

    const answer = makeAnswer({ questionId: question.id })
    await answersRepository.create(answer)

    await chooseQuestionBestAnswerUseCase.execute({
      answerId: answer.id.value,
      authorId: question.authorId.value,
    })

    expect(questionsRepository.items[0]?.bestAnswerId).toEqual(answer.id)
  })

  it('should not be able to choose another user question best answer', async () => {
    const question = makeQuestion({ authorId: new UniqueEntityID('author-1') })
    await questionsRepository.create(question)

    const answer = makeAnswer({ questionId: question.id })
    await answersRepository.create(answer)

    const result = await chooseQuestionBestAnswerUseCase.execute({
      answerId: answer.id.value,
      authorId: 'another-author',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
