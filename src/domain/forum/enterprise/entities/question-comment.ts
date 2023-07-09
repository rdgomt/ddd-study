import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { Optional } from '@/utils/typescript.utils'
import { Comment, CommentProps } from './comment'

export interface QuestionCommentProps extends CommentProps {
  questionId: UniqueEntityID
}

export type CreateQuestionCommentProps = Optional<QuestionCommentProps, 'createdAt'>

export class QuestionComment extends Comment<QuestionCommentProps> {
  static create(props: CreateQuestionCommentProps, id?: UniqueEntityID) {
    return new QuestionComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }

  get questionId() {
    return this.props.questionId
  }
}
