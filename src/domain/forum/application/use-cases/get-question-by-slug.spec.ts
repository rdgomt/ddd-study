import { makeAttachment } from '@/tests/factories/make-attachment'
import { makeQuestion } from '@/tests/factories/make-question'
import { makeQuestionAttachment } from '@/tests/factories/make-question-attachment'
import { makeStudent } from '@/tests/factories/make-student'
import { InMemoryAttachmentsRepository } from '@/tests/repositories/inm-attachments-repository'
import { InMemoryQuestionAttachmentsRepository } from '@/tests/repositories/inm-question-attachments-repository'
import { InMemoryQuestionsRepository } from '@/tests/repositories/inm-questions-repository'
import { InMemoryStudentsRepository } from '@/tests/repositories/inm-students-repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'

let studentsRepository: InMemoryStudentsRepository
let attachmentsRepository: InMemoryAttachmentsRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let questionsRepository: InMemoryQuestionsRepository
let getQuestionBySlugUseCase: GetQuestionBySlugUseCase

describe('GetQuestionBySlugUseCase', () => {
  beforeEach(() => {
    studentsRepository = new InMemoryStudentsRepository()
    attachmentsRepository = new InMemoryAttachmentsRepository()
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()

    questionsRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
      attachmentsRepository,
      studentsRepository,
    )

    getQuestionBySlugUseCase = new GetQuestionBySlugUseCase(questionsRepository)
  })

  it('should be able to get a question by slug', async () => {
    const student = makeStudent()

    await studentsRepository.create(student)

    const newQuestion = makeQuestion({
      authorId: student.id,
    })

    await questionsRepository.create(newQuestion)

    const attachment = makeAttachment()

    await attachmentsRepository.create(attachment)

    await questionAttachmentsRepository.createMany([
      makeQuestionAttachment({
        attachmentId: attachment.id,
        questionId: newQuestion.id,
      }),
    ])

    const result = await getQuestionBySlugUseCase.execute({
      slug: newQuestion.slug.value,
    })

    expect(result.isRight()).toBe(true)

    if (!result.isRight()) {
      return
    }

    expect(result.value).toMatchObject({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      question: expect.objectContaining({
        attachments: [
          expect.objectContaining({
            title: attachment.title,
          }),
        ],
        authorName: student.name,
        title: newQuestion.title,
      }),
    })
  })
})
