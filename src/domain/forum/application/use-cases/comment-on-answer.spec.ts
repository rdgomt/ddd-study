import { makeAnswer } from '@/test/factories/make-answer'
import { InMemoryAnswerAttachmentsRepository } from '@/test/repositories/inm-answer-attachments-repository'
import { InMemoryAnswerCommentsRepository } from '@/test/repositories/inm-answer-comments-repository'
import { InMemoryAnswersRepository } from '@/test/repositories/inm-answers-repository'
import { faker } from '@faker-js/faker'
import { CommentOnAnswerUseCase } from './comment-on-answer'

const COMMENT_CONTENT = faker.lorem.text()
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let answersRepository: InMemoryAnswersRepository
let answerCommentsRepository: InMemoryAnswerCommentsRepository
let commentOnAnswerUseCase: CommentOnAnswerUseCase

describe('CommentOnAnswerUseCase', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answersRepository = new InMemoryAnswersRepository(answerAttachmentsRepository)
    answerCommentsRepository = new InMemoryAnswerCommentsRepository()
    commentOnAnswerUseCase = new CommentOnAnswerUseCase(answersRepository, answerCommentsRepository)
  })

  it('should be able to comment on answer', async () => {
    const answer = makeAnswer()

    await answersRepository.create(answer)

    const result = await commentOnAnswerUseCase.execute({
      answerId: answer.id.value,
      authorId: answer.authorId.value,
      content: COMMENT_CONTENT,
    })

    expect(result.isRight()).toBe(true)
    expect(answerCommentsRepository.items[0]?.content).toEqual(COMMENT_CONTENT)
  })
})
