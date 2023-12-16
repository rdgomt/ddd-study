import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { makeAnswerComment } from '@/tests/factories/make-answer-comment'
import { makeStudent } from '@/tests/factories/make-student'
import { InMemoryAnswerCommentsRepository } from '@/tests/repositories/inm-answer-comments-repository'
import { InMemoryStudentsRepository } from '@/tests/repositories/inm-students-repository'
import { GetAnswerCommentsUseCase } from './get-answer-comments'

const answerId = 'answer-id'
let studentsRepository: InMemoryStudentsRepository
let answerCommentsRepository: InMemoryAnswerCommentsRepository
let getAnswerCommentsUseCase: GetAnswerCommentsUseCase

describe('GetAnswerCommentsUseCase', () => {
  beforeEach(() => {
    studentsRepository = new InMemoryStudentsRepository()
    answerCommentsRepository = new InMemoryAnswerCommentsRepository(studentsRepository)
    getAnswerCommentsUseCase = new GetAnswerCommentsUseCase(answerCommentsRepository)
  })

  it('should be able to get answer comments', async () => {
    const student = makeStudent()

    await studentsRepository.create(student)

    await Promise.all(
      Array.from({ length: 3 }).map((_, index) => {
        return answerCommentsRepository.create(
          makeAnswerComment(
            {
              answerId: new UniqueEntityID(answerId),
              authorId: student.id,
            },
            new UniqueEntityID(index.toFixed(0)),
          ),
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

    expect(result.value?.comments).toHaveLength(3)

    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          authorName: student.name,
          commentId: new UniqueEntityID('0'),
        }),
        expect.objectContaining({
          authorName: student.name,
          commentId: new UniqueEntityID('1'),
        }),
        expect.objectContaining({
          authorName: student.name,
          commentId: new UniqueEntityID('2'),
        }),
      ]),
    )
  })

  it('should be able to get paginated answer comments', async () => {
    const student = makeStudent()

    await studentsRepository.create(student)

    await Promise.all(
      Array.from({ length: 22 }).map(() => {
        return answerCommentsRepository.create(
          makeAnswerComment({
            answerId: new UniqueEntityID(answerId),
            authorId: student.id,
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
    expect(result.value?.comments).toHaveLength(2)
  })
})
