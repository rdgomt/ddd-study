import { makeQuestion } from '@/test/factories/make-question'
import { InMemoryQuestionCommentsRepository } from '@/test/repositories/inm-question-comments-repository'
import { InMemoryQuestionsRepository } from '@/test/repositories/inm-questions-repository'
import { faker } from '@faker-js/faker'
import { CommentOnQuestionUseCase } from './comment-on-question'

const COMMENT_CONTENT = faker.lorem.text()
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let commentOnQuestionUseCase: CommentOnQuestionUseCase

describe('CommentOnQuestionUseCase', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository()
    commentOnQuestionUseCase = new CommentOnQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionCommentsRepository,
    )
  })

  it('should be able to comment on question', async () => {
    const question = makeQuestion()

    await inMemoryQuestionsRepository.create(question)

    await commentOnQuestionUseCase.execute({
      questionId: question.id.value,
      authorId: question.authorId.value,
      content: COMMENT_CONTENT,
    })

    expect(inMemoryQuestionCommentsRepository.items[0].content).toEqual(COMMENT_CONTENT)
  })
})
