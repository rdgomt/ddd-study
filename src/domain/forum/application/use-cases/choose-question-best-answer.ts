import { Question } from '../../enterprise/entities/question'
import { AnswersRepository } from '../repositories/answers-repository'
import { QuestionsRepository } from '../repositories/questions-repository'

interface ChooseQuestionBestAnswerUseCaseInput {
  answerId: string
  authorId: string
}

interface ChooseQuestionBestAnswerUseCaseOutput {
  question: Question
}

export class ChooseQuestionBestAnswerUseCase {
  constructor(private answersRepository: AnswersRepository, private questionsRepository: QuestionsRepository) {}

  async execute({
    authorId,
    answerId,
  }: ChooseQuestionBestAnswerUseCaseInput): Promise<ChooseQuestionBestAnswerUseCaseOutput> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      throw new Error('Answer not found.')
    }

    const question = await this.questionsRepository.findById(answer.questionId.value)

    if (!question) {
      throw new Error('Question not found.')
    }

    if (authorId !== question.authorId.value) {
      throw new Error('Unauthorized')
    }

    question.bestAnswerId = answer.id

    await this.questionsRepository.save(question)

    return {
      question,
    }
  }
}
