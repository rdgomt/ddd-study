import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { Optional } from '@/utils/typescript/types'
import { QuestionCommentCreatedEvent } from '../events/question-comment-created-event'
import { Comment, CommentProps } from './comment'

export interface QuestionCommentProps extends CommentProps {
  questionId: UniqueEntityID
}

export type CreateQuestionCommentProps = Optional<QuestionCommentProps, 'createdAt'>

export class QuestionComment extends Comment<QuestionCommentProps> {
  static create(props: CreateQuestionCommentProps, id?: UniqueEntityID) {
    const questionComment = new QuestionComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    const isNewQuestionComment = !id

    if (isNewQuestionComment) {
      questionComment.addDomainEvent(new QuestionCommentCreatedEvent(questionComment))
    }

    return questionComment
  }

  get questionId() {
    return this.props.questionId
  }
}
