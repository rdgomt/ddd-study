import { randomUUID } from 'node:crypto'

export class UniqueEntityID {
  public readonly value: string

  constructor(value?: string) {
    this.value = value ?? randomUUID()
  }

  public equals(id: UniqueEntityID) {
    return id.value === this.value
  }
}
