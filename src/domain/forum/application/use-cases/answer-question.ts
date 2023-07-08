import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'

interface AnswerQuestionUseCaseInput {
  instructorId: string
  questionId: string
  content: string
}

interface AnswerQuestionUseCaseOutput {
  answer: Answer
}

export class AnswerQuestionUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    instructorId,
    questionId,
    content,
  }: AnswerQuestionUseCaseInput): Promise<AnswerQuestionUseCaseOutput> {
    const answer = Answer.create({
      content,
      authorId: new UniqueEntityID(instructorId),
      questionId: new UniqueEntityID(questionId),
    })

    await this.answersRepository.create(answer)

    return {
      answer,
    }
  }
}
