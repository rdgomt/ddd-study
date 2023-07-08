import { AnswersRepository } from '../repositories/answers-repository'

interface DeleteAnswerUseCaseInput {
  answerId: string
  authorId: string
}

export class DeleteAnswerUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({ authorId, answerId }: DeleteAnswerUseCaseInput): Promise<void> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      throw new Error('Answer not found.')
    }

    if (authorId !== answer.authorId.value) {
      throw new Error('Unauthorized')
    }

    await this.answersRepository.delete(answer)
  }
}
