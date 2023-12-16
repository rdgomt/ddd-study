import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { makeQuestionComment } from '@/tests/factories/make-question-comment'
import { makeStudent } from '@/tests/factories/make-student'
import { InMemoryQuestionCommentsRepository } from '@/tests/repositories/inm-question-comments-repository'
import { InMemoryStudentsRepository } from '@/tests/repositories/inm-students-repository'
import { GetQuestionCommentsUseCase } from './get-question-comments'

const questionId = 'question-id'
let studentsRepository: InMemoryStudentsRepository
let questionCommentsRepository: InMemoryQuestionCommentsRepository
let getQuestionCommentsUseCase: GetQuestionCommentsUseCase

describe('GetQuestionCommentsUseCase', () => {
  beforeEach(() => {
    studentsRepository = new InMemoryStudentsRepository()
    questionCommentsRepository = new InMemoryQuestionCommentsRepository(studentsRepository)
    getQuestionCommentsUseCase = new GetQuestionCommentsUseCase(questionCommentsRepository)
  })

  it('should be able to get question comments', async () => {
    const student = makeStudent()

    await studentsRepository.create(student)

    await Promise.all(
      Array.from({ length: 3 }).map((_, index) => {
        return questionCommentsRepository.create(
          makeQuestionComment(
            {
              authorId: student.id,
              questionId: new UniqueEntityID(questionId),
            },
            new UniqueEntityID(index.toFixed(0)),
          ),
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

  it('should be able to get paginated question comments', async () => {
    const student = makeStudent()

    await studentsRepository.create(student)

    await Promise.all(
      Array.from({ length: 22 }).map(() => {
        return questionCommentsRepository.create(
          makeQuestionComment({
            authorId: student.id,
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
    expect(result.value?.comments).toHaveLength(2)
  })
})
