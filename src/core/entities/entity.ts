import { UniqueEntityID } from './value-objects/unique-entity-id'

export abstract class Entity<Props> {
  private _id: UniqueEntityID
  protected props: Props

  protected constructor(props: Props, id?: UniqueEntityID) {
    this.props = props
    this._id = id ?? new UniqueEntityID()
  }

  public equals(entity: Entity<unknown>): boolean {
    return entity === this || entity.id === this._id
  }

  get id() {
    return this._id
  }
}
