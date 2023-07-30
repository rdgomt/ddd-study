import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { makeQuestionComment } from '@/tests/factories/make-question-comment'
import { InMemoryQuestionCommentsRepository } from '@/tests/repositories/inm-question-comments-repository'
import { GetQuestionCommentsUseCase } from './get-question-comments'

const questionId = 'question-id'
let questionCommentsRepository: InMemoryQuestionCommentsRepository
let getQuestionCommentsUseCase: GetQuestionCommentsUseCase

describe('GetQuestionCommentsUseCase', () => {
  beforeEach(() => {
    questionCommentsRepository = new InMemoryQuestionCommentsRepository()
    getQuestionCommentsUseCase = new GetQuestionCommentsUseCase(questionCommentsRepository)
  })

  it('should be able to get question comments', async () => {
    await Promise.all(
      Array.from({ length: 3 }).map(() => {
        return questionCommentsRepository.create(
          makeQuestionComment({
            questionId: new UniqueEntityID(questionId),
          }),
        )
      }),
    )

    const result = await getQuestionCommentsUseCase.execute({
      pagination: {
        page: 1,
      },
      questionId,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.questionComments).toHaveLength(3)
  })

  it('should be able to get paginated question comments', async () => {
    await Promise.all(
      Array.from({ length: 22 }).map(() => {
        return questionCommentsRepository.create(
          makeQuestionComment({
            questionId: new UniqueEntityID(questionId),
          }),
        )
      }),
    )

    const result = await getQuestionCommentsUseCase.execute({
      pagination: {
        page: 2,
      },
      questionId,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.questionComments).toHaveLength(2)
  })
})
