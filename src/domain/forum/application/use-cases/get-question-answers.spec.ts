import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { makeAnswer } from '@/tests/factories/make-answer'
import { InMemoryAnswerAttachmentsRepository } from '@/tests/repositories/inm-answer-attachments-repository'
import { InMemoryAnswersRepository } from '@/tests/repositories/inm-answers-repository'
import { GetQuestionAnswersUseCase } from './get-question-answers'

const questionId = 'question-id'
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let answersRepository: InMemoryAnswersRepository
let getQuestionAnswersUseCase: GetQuestionAnswersUseCase

describe('GetQuestionAnswersUseCase', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answersRepository = new InMemoryAnswersRepository(answerAttachmentsRepository)
    getQuestionAnswersUseCase = new GetQuestionAnswersUseCase(answersRepository)
  })

  it('should be able to get question answers', async () => {
    await Promise.all(
      Array.from({ length: 3 }).map(() => {
        return answersRepository.create(
          makeAnswer({
            questionId: new UniqueEntityID(questionId),
          }),
        )
      }),
    )

    const result = await getQuestionAnswersUseCase.execute({
      pagination: {
        page: 1,
      },
      questionId,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.answers).toHaveLength(3)
  })

  it('should be able to get paginated question answers', async () => {
    await Promise.all(
      Array.from({ length: 22 }).map(() => {
        return answersRepository.create(
          makeAnswer({
            questionId: new UniqueEntityID(questionId),
          }),
        )
      }),
    )

    const result = await getQuestionAnswersUseCase.execute({
      pagination: {
        page: 2,
      },
      questionId,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.answers).toHaveLength(2)
  })
})
