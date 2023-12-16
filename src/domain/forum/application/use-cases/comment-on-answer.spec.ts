import { makeAnswer } from '@/tests/factories/make-answer'
import { InMemoryAnswerAttachmentsRepository } from '@/tests/repositories/inm-answer-attachments-repository'
import { InMemoryAnswerCommentsRepository } from '@/tests/repositories/inm-answer-comments-repository'
import { InMemoryAnswersRepository } from '@/tests/repositories/inm-answers-repository'
import { InMemoryStudentsRepository } from '@/tests/repositories/inm-students-repository'
import { faker } from '@faker-js/faker'
import { CommentOnAnswerUseCase } from './comment-on-answer'

const COMMENT_CONTENT = faker.lorem.text()
let studentsRepository: InMemoryStudentsRepository
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let answersRepository: InMemoryAnswersRepository
let answerCommentsRepository: InMemoryAnswerCommentsRepository
let commentOnAnswerUseCase: CommentOnAnswerUseCase

describe('CommentOnAnswerUseCase', () => {
  beforeEach(() => {
    studentsRepository = new InMemoryStudentsRepository()
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answersRepository = new InMemoryAnswersRepository(answerAttachmentsRepository)
    answerCommentsRepository = new InMemoryAnswerCommentsRepository(studentsRepository)
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
