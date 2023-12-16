import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { makeAnswerComment } from '@/tests/factories/make-answer-comment'
import { InMemoryAnswerCommentsRepository } from '@/tests/repositories/inm-answer-comments-repository'
import { InMemoryStudentsRepository } from '@/tests/repositories/inm-students-repository'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'

let studentsRepository: InMemoryStudentsRepository
let answerCommentsRepository: InMemoryAnswerCommentsRepository
let deleteAnswerCommentUseCase: DeleteAnswerCommentUseCase

describe('DeleteAnswerCommentUseCase', () => {
  beforeEach(() => {
    studentsRepository = new InMemoryStudentsRepository()
    answerCommentsRepository = new InMemoryAnswerCommentsRepository(studentsRepository)
    deleteAnswerCommentUseCase = new DeleteAnswerCommentUseCase(answerCommentsRepository)
  })

  it('should be able to delete a answer comment', async () => {
    const answerComment = makeAnswerComment()

    await answerCommentsRepository.create(answerComment)

    const result = await deleteAnswerCommentUseCase.execute({
      answerCommentId: answerComment.id.value,
      authorId: answerComment.authorId.value,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toBe(null)
    expect(answerCommentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete another user answer comment', async () => {
    const answerComment = makeAnswerComment({
      authorId: new UniqueEntityID('author-1'),
    })

    await answerCommentsRepository.create(answerComment)

    const result = await deleteAnswerCommentUseCase.execute({
      answerCommentId: answerComment.id.value,
      authorId: 'author-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
