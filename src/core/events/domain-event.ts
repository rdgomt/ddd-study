import { UniqueEntityID } from '../entities/value-objects/unique-entity-id'

export interface DomainEvent {
  getAggregateId: () => UniqueEntityID
  ocurredAt: Date
}
