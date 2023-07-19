import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { makeAnswerComment } from '@/test/factories/make-answer-comment'
import { InMemoryAnswerCommentsRepository } from '@/test/repositories/inm-answer-comments-repository'
import { GetAnswerCommentsUseCase } from './get-answer-comments'

const answerId = 'answer-id'
let answerCommentsRepository: InMemoryAnswerCommentsRepository
let getAnswerCommentsUseCase: GetAnswerCommentsUseCase

describe('GetAnswerCommentsUseCase', () => {
  beforeEach(() => {
    answerCommentsRepository = new InMemoryAnswerCommentsRepository()
    getAnswerCommentsUseCase = new GetAnswerCommentsUseCase(answerCommentsRepository)
  })

  it('should be able to get answer comments', async () => {
    await Promise.all(
      Array.from({ length: 3 }).map(() => {
        return answerCommentsRepository.create(
          makeAnswerComment({
            answerId: new UniqueEntityID(answerId),
          }),
        )
      }),
    )

    const result = await getAnswerCommentsUseCase.execute({
      answerId,
      pagination: {
        page: 1,
      },
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.answerComments).toHaveLength(3)
  })

  it('should be able to get paginated answer comments', async () => {
    await Promise.all(
      Array.from({ length: 22 }).map(() => {
        return answerCommentsRepository.create(
          makeAnswerComment({
            answerId: new UniqueEntityID(answerId),
          }),
        )
      }),
    )

    const result = await getAnswerCommentsUseCase.execute({
      answerId,
      pagination: {
        page: 2,
      },
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.answerComments).toHaveLength(2)
  })
})