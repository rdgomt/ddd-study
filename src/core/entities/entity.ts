import { UniqueEntityID } from './value-objects/unique-entity-id'

export abstract class Entity<Props> {
  private _id: UniqueEntityID
  protected props: Props

  protected constructor(props: Props, id?: UniqueEntityID) {
    this.props = props
    this._id = id ?? new UniqueEntityID()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public equals(entity: Entity<any>): boolean {
    return entity === this || entity.id === this._id
  }

  get id() {
    return this._id
  }
}
