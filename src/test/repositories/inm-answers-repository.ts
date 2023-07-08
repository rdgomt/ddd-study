import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

export class InMemoryAnswersRepository implements AnswersRepository {
  private answers: Answer[] = []

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
}
