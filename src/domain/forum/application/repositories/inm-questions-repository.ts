import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from './questions-repository'

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public questions: Question[] = []

  async create(question: Question) {
    this.questions.push(question)
  }

  async findBySlug(slug: string) {
    return this.questions.find((question) => question.slug.value === slug) || null
  }
}
