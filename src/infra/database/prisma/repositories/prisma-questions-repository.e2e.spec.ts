import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { AppModule } from '@/infra/app.module'
import { CacheRepository } from '@/infra/cache/cache-repository'
import { CacheModule } from '@/infra/cache/cache.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { AttachmentFactory } from '@/tests/factories/make-attachment'
import { QuestionFactory } from '@/tests/factories/make-question'
import { QuestionAttachmentFactory } from '@/tests/factories/make-question-attachment'
import { StudentFactory } from '@/tests/factories/make-student'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'

describe('Prisma Questions Repository (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let attachmentFactory: AttachmentFactory
  let questionAttachmentFactory: QuestionAttachmentFactory
  let cacheRepository: CacheRepository
  let questionsRepository: QuestionsRepository

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
      providers: [StudentFactory, QuestionFactory, AttachmentFactory, QuestionAttachmentFactory],
    }).compile()

    app = testingModule.createNestApplication()

    studentFactory = testingModule.get(StudentFactory)
    questionFactory = testingModule.get(QuestionFactory)
    attachmentFactory = testingModule.get(AttachmentFactory)
    questionAttachmentFactory = testingModule.get(QuestionAttachmentFactory)
    cacheRepository = testingModule.get(CacheRepository)
    questionsRepository = testingModule.get(QuestionsRepository)

    await app.init()
  })

  it('should cache question details', async () => {
    const user = await studentFactory.makePrismaStudent()

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const attachment = await attachmentFactory.makePrismaAttachment()

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    })

    const slug = question.slug.value
    const questionDetails = await questionsRepository.findDetailsBySlug(slug)
    const cached = await cacheRepository.get(`question:${slug}:details`)

    expect(cached).toEqual(JSON.stringify(questionDetails))
  })

  it('should return cached question details on subsequent calls', async () => {
    const user = await studentFactory.makePrismaStudent()

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const attachment = await attachmentFactory.makePrismaAttachment()

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    })

    const slug = question.slug.value

    await cacheRepository.set(`question:${slug}:details`, JSON.stringify({ empty: true }))

    const questionDetails = await questionsRepository.findDetailsBySlug(slug)

    expect(questionDetails).toEqual({ empty: true })
  })

  it('should reset question details cache when saving the question', async () => {
    const user = await studentFactory.makePrismaStudent()

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const attachment = await attachmentFactory.makePrismaAttachment()

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    })

    const slug = question.slug.value

    await cacheRepository.set(`question:${slug}:details`, JSON.stringify({ empty: true }))

    await questionsRepository.save(question)

    const cached = await cacheRepository.get(`question:${slug}:details`)

    expect(cached).toBeNull()
  })
})
