import { QuestionsRepository } from '../repositories/questions-repository'

interface EditQuestionUseCaseInput {
  authorId: string
  content: string
  questionId: string
  title: string
}

export class EditQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({ authorId, questionId, title, content }: EditQuestionUseCaseInput): Promise<void> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      throw new Error('Question not found.')
    }

    // console.log('question', question)
    // console.log('authorId', authorId)
    // console.log('question.authorId.value', question.authorId.value)
    // console.log('authorId', authorId === question.authorId.value)

    if (authorId !== question.authorId.value) {
      throw new Error('Unauthorized')
    }

    question.title = title
    question.content = content

    await this.questionsRepository.save(question)
  }
}
