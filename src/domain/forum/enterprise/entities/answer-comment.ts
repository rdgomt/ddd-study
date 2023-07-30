import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { Optional } from '@/utils/typescript.utils'
import { AnswerCommentCreatedEvent } from '../events/answer-comment-created-event'
import { Comment, CommentProps } from './comment'

export interface AnswerCommentProps extends CommentProps {
  answerId: UniqueEntityID
}

export type CreateAnswerCommentProps = Optional<AnswerCommentProps, 'createdAt'>

export class AnswerComment extends Comment<AnswerCommentProps> {
  static create(props: CreateAnswerCommentProps, id?: UniqueEntityID) {
    const answerComment = new AnswerComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    const isNewAnswerComment = !id

    if (isNewAnswerComment) {
      answerComment.addDomainEvent(new AnswerCommentCreatedEvent(answerComment))
    }

    return answerComment
  }

  get answerId() {
    return this.props.answerId
  }
}
