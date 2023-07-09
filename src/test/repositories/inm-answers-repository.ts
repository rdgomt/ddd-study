import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = []

  private findIndexById(id: string) {
    return this.items.findIndex((item) => item.id.value === id)
  }

  async create(answer: Answer) {
    this.items.push(answer)
  }

  async delete(answer: Answer) {
    const index = this.items.findIndex((item) => item.id === answer.id)
    this.items.splice(index, 1)
  }

  async findById(answerId: string) {
    return this.items.find((item) => item.id.value === answerId) || null
  }

  async save(answer: Answer) {
    const index = this.findIndexById(answer.id.value)
    this.items[index] = answer
  }
}
