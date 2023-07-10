import { makeAnswer } from '@/test/factories/make-answer'
import { InMemoryAnswerCommentsRepository } from '@/test/repositories/inm-answer-comments-repository'
import { InMemoryAnswersRepository } from '@/test/repositories/inm-answers-repository'
import { faker } from '@faker-js/faker'
import { CommentOnAnswerUseCase } from './comment-on-answer'

const COMMENT_CONTENT = faker.lorem.text()
let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let commentOnAnswerUseCase: CommentOnAnswerUseCase

describe('CommentOnAnswerUseCase', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    commentOnAnswerUseCase = new CommentOnAnswerUseCase(inMemoryAnswersRepository, inMemoryAnswerCommentsRepository)
  })

  it('should be able to comment on answer', async () => {
    const answer = makeAnswer()

    await inMemoryAnswersRepository.create(answer)

    await commentOnAnswerUseCase.execute({
      answerId: answer.id.value,
      authorId: answer.authorId.value,
      content: COMMENT_CONTENT,
    })

    expect(inMemoryAnswerCommentsRepository.items[0].content).toEqual(COMMENT_CONTENT)
  })
})
