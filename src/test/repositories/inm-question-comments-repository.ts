import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'

const ITEMS_PER_PAGE = 20

export class InMemoryQuestionCommentsRepository implements QuestionCommentsRepository {
  public items: QuestionComment[] = []

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment)
  }

  async delete(questionComment: QuestionComment) {
    const itemIndex = this.items.findIndex((item) => item.id === questionComment.id)

    this.items.splice(itemIndex, 1)
  }

  async findById(id: string) {
    const questionComment = this.items.find((item) => item.id.value === id)

    if (!questionComment) {
      return null
    }

    return questionComment
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    return this.items
      .filter((item) => item.questionId.value === questionId)
      .slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)
  }
}
