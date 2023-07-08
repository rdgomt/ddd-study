import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { Question } from '../../enterprise/entities/question'
import { InMemoryQuestionsRepository } from '../repositories/inm-questions-repository'
import { QuestionsRepository } from '../repositories/questions-repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'

let questionsRepository: QuestionsRepository
let getQuestionBySlugUseCase: GetQuestionBySlugUseCase

describe('GetQuestionBySlugUseCase', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    getQuestionBySlugUseCase = new GetQuestionBySlugUseCase(questionsRepository)
  })

  it('should be able to get a question by slug', async () => {
    const newQuestion = Question.create({
      authorId: new UniqueEntityID(),
      title: 'title',
      content: 'content',
    })

    await questionsRepository.create(newQuestion)

    const { question } = await getQuestionBySlugUseCase.execute({
      slug: 'title',
    })

    expect(question.id).toEqual(newQuestion.id)
  })
})
