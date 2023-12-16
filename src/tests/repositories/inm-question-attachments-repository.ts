import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'

export class InMemoryQuestionAttachmentsRepository implements QuestionAttachmentsRepository {
  public items: QuestionAttachment[] = []

  async createMany(attachments: QuestionAttachment[]) {
    this.items.push(...attachments)
  }

  async deleteMany(attachments: QuestionAttachment[]) {
    const questionAttachments = this.items.filter((item) => {
      return !attachments.some((attachment) => attachment.equals(item))
    })

    this.items = questionAttachments
  }

  async deleteManyByQuestionId(questionId: string) {
    this.items = this.items.filter((item) => item.questionId.value !== questionId)
  }

  async findManyByQuestionId(questionId: string) {
    return this.items.filter((item) => item.questionId.value === questionId)
  }
}
