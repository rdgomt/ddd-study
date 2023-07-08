import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

export class InMemoryAnswersRepository implements AnswersRepository {
  public answers: Answer[] = []

  private findIndexById(id: string) {
    return this.answers.findIndex((item) => item.id.value === id)
  }

  async create(answer: Answer) {
    this.answers.push(answer)
  }

  async delete(answer: Answer) {
    const index = this.answers.findIndex((item) => item.id === answer.id)
    this.answers.splice(index, 1)
  }

  async findById(answerId: string) {
    return this.answers.find((item) => item.id.value === answerId) || null
  }

  async save(answer: Answer) {
    const index = this.findIndexById(answer.id.value)
    this.answers[index] = answer
  }
}
