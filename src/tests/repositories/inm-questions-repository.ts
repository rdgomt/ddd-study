import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'

export class InMemoryQuestionsRepository implements QuestionsRepository {
  private readonly ITEMS_PER_PAGE = 20
  public items: Question[] = []

  constructor(private questionAttachmentsRepository: QuestionAttachmentsRepository) {}

  async create(question: Question) {
    this.items.push(question)
    await this.questionAttachmentsRepository.createMany(question.attachments.getItems())
    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async delete(question: Question) {
    const index = this.findIndexById(question.id.value)
    this.items.splice(index, 1)
    await this.questionAttachmentsRepository.deleteManyByQuestionId(question.id.value)
  }

  async findById(questionId: string) {
    return this.items.find((item) => item.id.value === questionId) || null
  }

  async findBySlug(slug: string) {
    return this.items.find((item) => item.slug.value === slug) || null
  }

  private findIndexById(id: string) {
    return this.items.findIndex((item) => item.id.value === id)
  }

  async findManyRecent({ page }: PaginationParams) {
    return this.items
      .map((item) => item)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * this.ITEMS_PER_PAGE, page * this.ITEMS_PER_PAGE)
  }

  async save(question: Question) {
    const index = this.findIndexById(question.id.value)
    this.items[index] = question
    await this.questionAttachmentsRepository.createMany(question.attachments.getNewItems())
    await this.questionAttachmentsRepository.deleteMany(question.attachments.getRemovedItems())
    DomainEvents.dispatchEventsForAggregate(question.id)
  }
}
