import { InMemoryAttachmentsRepository } from '@/tests/repositories/inm-attachments-repository'
import { FakeUploader } from '@/tests/storage/fake-uploader'
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type-error'
import { UploadAndCreateAttachmentUseCase } from './upload-and-create-attachment'

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let fakeUploader: FakeUploader
let uploadAndCreateAttachments: UploadAndCreateAttachmentUseCase

describe('UploadAndCreateAttachmentUseCase', () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    fakeUploader = new FakeUploader()
    uploadAndCreateAttachments = new UploadAndCreateAttachmentUseCase(inMemoryAttachmentsRepository, fakeUploader)
  })

  it('should be able to upload and create an attachment', async () => {
    const result = await uploadAndCreateAttachments.execute({
      body: Buffer.from(''),
      fileName: 'profile.png',
      fileType: 'image/png',
    })

    expect(result.isRight()).toBe(true)

    expect(result.value).toEqual({
      attachment: inMemoryAttachmentsRepository.items[0],
    })

    expect(fakeUploader.uploads).toHaveLength(1)

    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'profile.png',
      }),
    )
  })

  it('should not be able to upload an attachment with invalid file type', async () => {
    const result = await uploadAndCreateAttachments.execute({
      body: Buffer.from(''),
      fileName: 'profile.mp3',
      fileType: 'audio/mpeg',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError)
  })
})
