import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

export class InMemoryAnswersRepository implements AnswersRepository {
  private readonly ITEMS_PER_PAGE = 20
  public items: Answer[] = []

  constructor(private answerAttachmentsRepository: AnswerAttachmentsRepository) {}

  async create(answer: Answer) {
    this.items.push(answer)
    await this.answerAttachmentsRepository.createMany(answer.attachments.getItems())
    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async delete(answer: Answer) {
    const index = this.items.findIndex((item) => item.id === answer.id)
    this.items.splice(index, 1)
    await this.answerAttachmentsRepository.deleteManyByAnswerId(answer.id.value)
  }

  async findById(answerId: string) {
    return this.items.find((item) => item.id.value === answerId) || null
  }

  private findIndexById(id: string) {
    return this.items.findIndex((item) => item.id.value === id)
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    return this.items
      .filter((item) => item.questionId.value === questionId)
      .slice((page - 1) * this.ITEMS_PER_PAGE, page * this.ITEMS_PER_PAGE)
  }

  async save(answer: Answer) {
    const index = this.findIndexById(answer.id.value)
    this.items[index] = answer
    await this.answerAttachmentsRepository.createMany(answer.attachments.getNewItems())
    await this.answerAttachmentsRepository.deleteMany(answer.attachments.getRemovedItems())
    DomainEvents.dispatchEventsForAggregate(answer.id)
  }
}
