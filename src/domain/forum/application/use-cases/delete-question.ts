import { QuestionsRepository } from '../repositories/questions-repository'

interface DeleteQuestionUseCaseInput {
  authorId: string
  questionId: string
}

export class DeleteQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({ authorId, questionId }: DeleteQuestionUseCaseInput): Promise<void> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      throw new Error('Question not found.')
    }

    if (authorId !== question.authorId.value) {
      throw new Error('Unauthorized')
    }

    await this.questionsRepository.delete(question)
  }
}
