import { makeQuestion } from '@/test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from '@/test/repositories/inm-question-attachments-repository'
import { InMemoryQuestionCommentsRepository } from '@/test/repositories/inm-question-comments-repository'
import { InMemoryQuestionsRepository } from '@/test/repositories/inm-questions-repository'
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
      questionId: question.id.value,
      authorId: question.authorId.value,
      content: COMMENT_CONTENT,
    })

    expect(result.isRight()).toBe(true)
    expect(questionCommentsRepository.items[0].content).toEqual(COMMENT_CONTENT)
  })
})
