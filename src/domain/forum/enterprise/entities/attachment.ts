import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'

export interface AttachmentProps {
  title: string
  url: string
}

export class Attachment extends Entity<AttachmentProps> {
  static create(props: AttachmentProps, id?: UniqueEntityID) {
    return new Attachment(props, id)
  }

  get title() {
    return this.props.title
  }

  get url() {
    return this.props.url
  }
}
