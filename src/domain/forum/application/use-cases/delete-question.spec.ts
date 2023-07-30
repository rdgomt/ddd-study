import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { makeQuestion } from '@/tests/factories/make-question'
import { makeQuestionAttachment } from '@/tests/factories/make-question-attachment'
import { InMemoryQuestionAttachmentsRepository } from '@/tests/repositories/inm-question-attachments-repository'
import { InMemoryQuestionsRepository } from '@/tests/repositories/inm-questions-repository'
import { DeleteQuestionUseCase } from './delete-question'

let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let questionsRepository: InMemoryQuestionsRepository
let deleteQuestionUseCase: DeleteQuestionUseCase

describe('DeleteQuestionUseCase', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionsRepository = new InMemoryQuestionsRepository(questionAttachmentsRepository)
    deleteQuestionUseCase = new DeleteQuestionUseCase(questionsRepository)
  })

  it('should be able to delete a question', async () => {
    const question = makeQuestion()

    await questionsRepository.create(question)

    questionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        attachmentId: new UniqueEntityID('1'),
        questionId: question.id,
      }),
      makeQuestionAttachment({
        attachmentId: new UniqueEntityID('2'),
        questionId: question.id,
      }),
    )

    const result = await deleteQuestionUseCase.execute({
      authorId: question.authorId.value,
      questionId: question.id.value,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toBe(null)
    expect(questionsRepository.items).toHaveLength(0)
    expect(questionAttachmentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a question from another author', async () => {
    const question = makeQuestion()

    await questionsRepository.create(question)

    const result = await deleteQuestionUseCase.execute({
      authorId: 'another-author-id',
      questionId: question.id.value,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
