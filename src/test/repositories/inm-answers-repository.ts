import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

const ITEMS_PER_PAGE = 20

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = []

  constructor(private answerAttachmentsRepository: AnswerAttachmentsRepository) {}

  private findIndexById(id: string) {
    return this.items.findIndex((item) => item.id.value === id)
  }

  async create(answer: Answer) {
    this.items.push(answer)
  }

  async delete(answer: Answer) {
    const index = this.items.findIndex((item) => item.id === answer.id)
    this.items.splice(index, 1)
    await this.answerAttachmentsRepository.deleteManyByAnswerId(answer.id.value)
  }

  async findById(answerId: string) {
    return this.items.find((item) => item.id.value === answerId) || null
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    return this.items
      .filter((item) => item.questionId.value === questionId)
      .slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)
  }

  async save(answer: Answer) {
    const index = this.findIndexById(answer.id.value)
    this.items[index] = answer
  }
}
