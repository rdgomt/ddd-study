import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { makeQuestionComment } from '@/test/factories/make-question-comment'
import { InMemoryQuestionCommentsRepository } from '@/test/repositories/inm-question-comments-repository'
import { DeleteQuestionCommentUseCase } from './delete-question-comment'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let deleteQuestionCommentUseCase: DeleteQuestionCommentUseCase

describe('DeleteQuestionCommentUseCase', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository()
    deleteQuestionCommentUseCase = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should be able to delete a question comment', async () => {
    const questionComment = makeQuestionComment()

    await inMemoryQuestionCommentsRepository.create(questionComment)

    await deleteQuestionCommentUseCase.execute({
      questionCommentId: questionComment.id.value,
      authorId: questionComment.authorId.value,
    })

    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete another user question comment', async () => {
    const questionComment = makeQuestionComment({
      authorId: new UniqueEntityID('author-1'),
    })

    await inMemoryQuestionCommentsRepository.create(questionComment)

    await expect(() => {
      return deleteQuestionCommentUseCase.execute({
        questionCommentId: questionComment.id.value,
        authorId: 'author-2',
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
