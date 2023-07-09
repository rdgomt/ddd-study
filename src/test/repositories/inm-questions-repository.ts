import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = []

  private findIndexById(id: string) {
    return this.items.findIndex((item) => item.id.value === id)
  }

  async create(question: Question) {
    this.items.push(question)
  }

  async delete(question: Question) {
    const index = this.findIndexById(question.id.value)
    this.items.splice(index, 1)
  }

  async findById(questionId: string) {
    return this.items.find((item) => item.id.value === questionId) || null
  }

  async findBySlug(slug: string) {
    return this.items.find((item) => item.slug.value === slug) || null
  }

  async save(question: Question) {
    const index = this.findIndexById(question.id.value)
    this.items[index] = question
  }
}
