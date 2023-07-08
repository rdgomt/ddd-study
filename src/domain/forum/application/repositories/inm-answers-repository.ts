import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from './answers-repository'

export class InMemoryAnswersRepository implements AnswersRepository {
  private answers: Answer[] = []

  async create(answer: Answer) {
    this.answers.push(answer)
  }
}
