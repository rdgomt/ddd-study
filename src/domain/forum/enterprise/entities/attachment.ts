import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'

interface AttachmentProps {
  link: string
  title: string
}

export class Attachment extends Entity<AttachmentProps> {
  static create(props: AttachmentProps, id?: UniqueEntityID) {
    return new Attachment(props, id)
  }

  get link() {
    return this.props.link
  }

  get title() {
    return this.props.title
  }
}
