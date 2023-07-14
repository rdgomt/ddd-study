import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { makeQuestionComment } from '@/test/factories/make-question-comment'
import { InMemoryQuestionCommentsRepository } from '@/test/repositories/inm-question-comments-repository'
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
      questionId,
      pagination: {
        page: 1,
      },
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
      questionId,
      pagination: {
        page: 2,
      },
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.questionComments).toHaveLength(2)
  })
})
