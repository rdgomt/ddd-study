import { Comment } from '@/domain/forum/enterprise/entities/comment'

export class CommentPresenter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static present(comment: Comment<any>) {
    return {
      id: comment.id.value,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }
  }
}
