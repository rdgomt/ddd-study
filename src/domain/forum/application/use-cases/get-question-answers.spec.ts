import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { makeAnswer } from '@/test/factories/make-answer'
import { InMemoryAnswerAttachmentsRepository } from '@/test/repositories/inm-answer-attachments-repository'
import { InMemoryAnswersRepository } from '@/test/repositories/inm-answers-repository'
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
      questionId,
      pagination: {
        page: 1,
      },
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
      questionId,
      pagination: {
        page: 2,
      },
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.answers).toHaveLength(2)
  })
})
