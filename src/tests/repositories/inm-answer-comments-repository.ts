import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

const ITEMS_PER_PAGE = 20

export class InMemoryAnswerCommentsRepository implements AnswerCommentsRepository {
  public items: AnswerComment[] = []

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment)
    DomainEvents.dispatchEventsForAggregate(answerComment.id)
  }

  async delete(answerComment: AnswerComment) {
    const itemIndex = this.items.findIndex((item) => item.id === answerComment.id)

    this.items.splice(itemIndex, 1)
  }

  async findById(id: string) {
    const answerComment = this.items.find((item) => item.id.value === id)

    if (!answerComment) {
      return null
    }

    return answerComment
  }

  async findManyByAnswerId(answerId: string, { page }: PaginationParams) {
    return this.items
      .filter((item) => item.answerId.value === answerId)
      .slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)
  }
}
