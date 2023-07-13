import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { makeAnswerComment } from '@/test/factories/make-answer-comment'
import { InMemoryAnswerCommentsRepository } from '@/test/repositories/inm-answer-comments-repository'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let deleteAnswerCommentUseCase: DeleteAnswerCommentUseCase

describe('DeleteAnswerCommentUseCase', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    deleteAnswerCommentUseCase = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to delete a answer comment', async () => {
    const answerComment = makeAnswerComment()

    await inMemoryAnswerCommentsRepository.create(answerComment)

    await deleteAnswerCommentUseCase.execute({
      answerCommentId: answerComment.id.value,
      authorId: answerComment.authorId.value,
    })

    expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete another user answer comment', async () => {
    const answerComment = makeAnswerComment({
      authorId: new UniqueEntityID('author-1'),
    })

    await inMemoryAnswerCommentsRepository.create(answerComment)

    await expect(() => {
      return deleteAnswerCommentUseCase.execute({
        answerCommentId: answerComment.id.value,
        authorId: 'author-2',
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
