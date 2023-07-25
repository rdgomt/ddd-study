import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { QuestionBestAnswerChosenEvent } from '@/domain/forum/enterprise/events/question-best-answer-chosen-event'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'

export class OnQuestionBestAnswerChosen implements EventHandler {
  constructor(private answersRepository: AnswersRepository, private sendNotification: SendNotificationUseCase) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      this.sendQuestionBestAnswerNotification.bind(this),
      QuestionBestAnswerChosenEvent.name,
    )
  }

  private async sendQuestionBestAnswerNotification({ question, bestAnswerId }: QuestionBestAnswerChosenEvent) {
    const answer = await this.answersRepository.findById(bestAnswerId.value)

    if (answer) {
      await this.sendNotification.execute({
        recipientId: answer.authorId.value,
        title: `Sua resposta foi escolhida!`,
        content: `A resposta que você enviou em "${question.title}" foi escolhida pelo autor!"`,
      })
    }
  }
}
