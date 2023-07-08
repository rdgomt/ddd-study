import { Nullable } from 'vitest'
import { Answer } from '../../enterprise/entities/answer'

export interface AnswersRepository {
  create: (answer: Answer) => Promise<void>
  delete: (answer: Answer) => Promise<void>
  findById: (answerId: string) => Promise<Nullable<Answer>>
}
