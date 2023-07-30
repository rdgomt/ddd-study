import { makeQuestion } from '@/tests/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from '@/tests/repositories/inm-question-attachments-repository'
import { InMemoryQuestionCommentsRepository } from '@/tests/repositories/inm-question-comments-repository'
import { InMemoryQuestionsRepository } from '@/tests/repositories/inm-questions-repository'
import { faker } from '@faker-js/faker'
import { CommentOnQuestionUseCase } from './comment-on-question'

const COMMENT_CONTENT = faker.lorem.text()
let questionsRepository: InMemoryQuestionsRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let questionCommentsRepository: InMemoryQuestionCommentsRepository
let commentOnQuestionUseCase: CommentOnQuestionUseCase

describe('CommentOnQuestionUseCase', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionsRepository = new InMemoryQuestionsRepository(questionAttachmentsRepository)
    questionCommentsRepository = new InMemoryQuestionCommentsRepository()
    commentOnQuestionUseCase = new CommentOnQuestionUseCase(questionsRepository, questionCommentsRepository)
  })

  it('should be able to comment on question', async () => {
    const question = makeQuestion()

    await questionsRepository.create(question)

    const result = await commentOnQuestionUseCase.execute({
      authorId: question.authorId.value,
      content: COMMENT_CONTENT,
      questionId: question.id.value,
    })

    expect(result.isRight()).toBe(true)
    expect(questionCommentsRepository.items[0]?.content).toEqual(COMMENT_CONTENT)
  })
})
