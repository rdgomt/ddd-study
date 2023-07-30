import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { QuestionCommentCreatedEvent } from '@/domain/forum/enterprise/events/question-comment-created-event'
import { SendNotificationUseCase } from '../use-cases/send-notification'

export class OnQuestionCommentCreated implements EventHandler {
  constructor(private questionsRepository: QuestionsRepository, private sendNotification: SendNotificationUseCase) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      this.sendNewQuestionCommentNotification.bind(this),
      QuestionCommentCreatedEvent.name,
    )
  }

  private async sendNewQuestionCommentNotification({ questionComment }: QuestionCommentCreatedEvent) {
    const question = await this.questionsRepository.findById(questionComment.questionId.value)

    if (!question) {
      return
    }

    await this.sendNotification.execute({
      content: questionComment.excerpt,
      recipientId: question.authorId.value,
      title: `Novo comentário em "${question.title}"`,
    })
  }
}
