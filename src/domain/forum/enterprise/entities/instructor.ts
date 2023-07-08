import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'

interface InstructorProps {
  name: string
}

export class Instructor extends Entity<InstructorProps> {
  static create(props: InstructorProps, id?: UniqueEntityID) {
    return new Instructor(props, id)
  }
}
