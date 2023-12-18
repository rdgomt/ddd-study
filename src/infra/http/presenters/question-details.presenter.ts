import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { AttachmentPresenter } from './attachment.presenter'

export class QuestionDetailsPresenter {
  static toHTTP(questionDetails: QuestionDetails) {
    return {
      questionId: questionDetails.questionId.value,
      authorId: questionDetails.authorId.value,
      authorName: questionDetails.authorName,
      title: questionDetails.title,
      content: questionDetails.content,
      slug: questionDetails.slug.value,
      bestAnswerId: questionDetails.bestAnswerId?.value,
      attachments: questionDetails.attachments.map((attachment) => AttachmentPresenter.toHTTP(attachment)),
      createdAt: questionDetails.createdAt,
      updatedAt: questionDetails.updatedAt,
    }
  }
}
