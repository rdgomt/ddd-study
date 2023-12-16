import { Question } from '@/domain/forum/enterprise/entities/question'

export class QuestionPresenter {
  static toHTTP(question: Question) {
    return {
      id: question.id.value,
      title: question.title,
      slug: question.slug.value,
      bestAnswer: question.bestAnswerId?.value,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    }
  }
}
