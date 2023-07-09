import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { Optional } from '@/utils/typescript.utils'
import { Comment, CommentProps } from './comment'

export interface AnswerCommentProps extends CommentProps {
  answerId: UniqueEntityID
}

export type CreateAnswerCommentProps = Optional<AnswerCommentProps, 'createdAt'>

export class AnswerComment extends Comment<AnswerCommentProps> {
  static create(props: CreateAnswerCommentProps, id?: UniqueEntityID) {
    return new AnswerComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }

  get answerId() {
    return this.props.answerId
  }
}
