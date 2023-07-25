import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'
import { Question } from '../entities/question'

export class QuestionBestAnswerChosenEvent implements DomainEvent {
  public bestAnswerId: UniqueEntityID
  public ocurredAt: Date
  public question: Question

  constructor(question: Question, bestAnswerId: UniqueEntityID) {
    this.bestAnswerId = bestAnswerId
    this.ocurredAt = new Date()
    this.question = question
  }

  getAggregateId(): UniqueEntityID {
    return this.question.id
  }
}
