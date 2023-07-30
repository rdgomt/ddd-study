import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { AnswerCommentCreatedEvent } from '@/domain/forum/enterprise/events/answer-comment-created-event'
import { SendNotificationUseCase } from '../use-cases/send-notification'

export class OnAnswerCommentCreated implements EventHandler {
  constructor(private answersRepository: AnswersRepository, private sendNotification: SendNotificationUseCase) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      this.sendNewAnswerCommentNotification.bind(this),
      AnswerCommentCreatedEvent.name,
    )
  }

  private async sendNewAnswerCommentNotification({ answerComment }: AnswerCommentCreatedEvent) {
    const answer = await this.answersRepository.findById(answerComment.answerId.value)

    if (!answer) {
      return
    }

    await this.sendNotification.execute({
      content: answerComment.excerpt,
      recipientId: answer.authorId.value,
      title: `Novo comentário em "${answer.excerpt}"`,
    })
  }
}
