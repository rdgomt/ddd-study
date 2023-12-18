import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { InMemoryAttachmentsRepository } from './inm-attachments-repository'
import { InMemoryQuestionAttachmentsRepository } from './inm-question-attachments-repository'
import { InMemoryStudentsRepository } from './inm-students-repository'

export class InMemoryQuestionsRepository implements QuestionsRepository {
  private readonly ITEMS_PER_PAGE = 20
  public items: Question[] = []

  constructor(
    private questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository,
    private attachmentsRepository: InMemoryAttachmentsRepository,
    private studentsRepository: InMemoryStudentsRepository,
  ) {}

  async create(question: Question) {
    this.items.push(question)
    await this.questionAttachmentsRepository.createMany(question.attachments.getItems())
    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async delete(question: Question) {
    const index = this.findIndexById(question.id.value)
    this.items.splice(index, 1)
    await this.questionAttachmentsRepository.deleteManyByQuestionId(question.id.value)
  }

  async findById(questionId: string) {
    return this.items.find((item) => item.id.value === questionId) || null
  }

  async findBySlug(slug: string) {
    return this.items.find((item) => item.slug.value === slug) || null
  }

  async findDetailsBySlug(slug: string) {
    const question = this.items.find((item) => item.slug.value === slug)

    if (!question) {
      return null
    }

    const author = this.studentsRepository.items.find((student) => {
      return student.id.equals(question.authorId)
    })

    if (!author) {
      throw new Error(`Author with ID "${question.authorId.value}" does not exist.`)
    }

    const questionAttachments = this.questionAttachmentsRepository.items.filter((questionAttachment) => {
      return questionAttachment.questionId.equals(question.id)
    })

    const attachments = questionAttachments.map((questionAttachment) => {
      const attachment = this.attachmentsRepository.items.find((item) => {
        return item.id.equals(questionAttachment.attachmentId)
      })

      if (!attachment) {
        throw new Error(`Attachment with ID "${questionAttachment.attachmentId.value}" does not exist.`)
      }

      return attachment
    })

    return QuestionDetails.create({
      attachments,
      authorId: question.authorId,
      authorName: author.name,
      bestAnswerId: question.bestAnswerId,
      content: question.content,
      createdAt: question.createdAt,
      questionId: question.id,
      slug: question.slug,
      title: question.title,
      updatedAt: question.updatedAt,
    })
  }

  private findIndexById(id: string) {
    return this.items.findIndex((item) => item.id.value === id)
  }

  async findManyRecent({ page }: PaginationParams) {
    return this.items
      .map((item) => item)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * this.ITEMS_PER_PAGE, page * this.ITEMS_PER_PAGE)
  }

  async save(question: Question) {
    const index = this.findIndexById(question.id.value)
    this.items[index] = question
    await this.questionAttachmentsRepository.createMany(question.attachments.getNewItems())
    await this.questionAttachmentsRepository.deleteMany(question.attachments.getRemovedItems())
    DomainEvents.dispatchEventsForAggregate(question.id)
  }
}
