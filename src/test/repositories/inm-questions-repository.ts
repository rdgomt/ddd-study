import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public questions: Question[] = []

  async create(question: Question) {
    this.questions.push(question)
  }

  async delete(question: Question) {
    const index = this.questions.findIndex((item) => item.id === question.id)
    this.questions.splice(index, 1)
  }

  async findById(questionId: string) {
    return this.questions.find((item) => item.id.value === questionId) || null
  }

  async findBySlug(slug: string) {
    return this.questions.find((item) => item.slug.value === slug) || null
  }
}
