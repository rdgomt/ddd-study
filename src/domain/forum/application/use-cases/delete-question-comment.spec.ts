import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { makeQuestionComment } from '@/tests/factories/make-question-comment'
import { InMemoryQuestionCommentsRepository } from '@/tests/repositories/inm-question-comments-repository'
import { DeleteQuestionCommentUseCase } from './delete-question-comment'

let questionCommentsRepository: InMemoryQuestionCommentsRepository
let deleteQuestionCommentUseCase: DeleteQuestionCommentUseCase

describe('DeleteQuestionCommentUseCase', () => {
  beforeEach(() => {
    questionCommentsRepository = new InMemoryQuestionCommentsRepository()
    deleteQuestionCommentUseCase = new DeleteQuestionCommentUseCase(questionCommentsRepository)
  })

  it('should be able to delete a question comment', async () => {
    const questionComment = makeQuestionComment()

    await questionCommentsRepository.create(questionComment)

    const result = await deleteQuestionCommentUseCase.execute({
      authorId: questionComment.authorId.value,
      questionCommentId: questionComment.id.value,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toBe(null)
    expect(questionCommentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete another user question comment', async () => {
    const questionComment = makeQuestionComment({
      authorId: new UniqueEntityID('author-1'),
    })

    await questionCommentsRepository.create(questionComment)

    const result = await deleteQuestionCommentUseCase.execute({
      authorId: 'author-2',
      questionCommentId: questionComment.id.value,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
