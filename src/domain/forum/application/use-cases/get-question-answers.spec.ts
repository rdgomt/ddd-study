import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { makeAnswer } from '@/test/factories/make-answer'
import { InMemoryAnswersRepository } from '@/test/repositories/inm-answers-repository'
import { AnswersRepository } from '../repositories/answers-repository'
import { GetQuestionAnswersUseCase } from './get-question-answers'

const questionId = 'question-id'
let answersRepository: AnswersRepository
let getQuestionAnswersUseCase: GetQuestionAnswersUseCase

describe('GetQuestionAnswersUseCase', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
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

    const { answers } = await getQuestionAnswersUseCase.execute({
      questionId,
      pagination: {
        page: 1,
      },
    })

    expect(answers).toHaveLength(3)
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

    const { answers } = await getQuestionAnswersUseCase.execute({
      questionId,
      pagination: {
        page: 2,
      },
    })

    expect(answers).toHaveLength(2)
  })
})
