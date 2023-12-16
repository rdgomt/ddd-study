import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Attachment } from '../../enterprise/entities/attachment'
import { AttachmentsRepository } from '../repositories/attachments-repository'
import { Uploader } from '../storage/uploader'
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type-error'

interface UploadAndCreateAttachmentInput {
  body: Buffer
  fileName: string
  fileType: string
}

type UploadAndCreateAttachmentOutput = Promise<Either<InvalidAttachmentTypeError, { attachment: Attachment }>>

@Injectable()
export class UploadAndCreateAttachmentUseCase {
  constructor(private attachmentsRepository: AttachmentsRepository, private uploader: Uploader) {}

  async execute({ body, fileName, fileType }: UploadAndCreateAttachmentInput): UploadAndCreateAttachmentOutput {
    if (!/^(image\/(jpeg|png))$|^application\/pdf$/.test(fileType)) {
      return left(new InvalidAttachmentTypeError(fileType))
    }

    // TODO: feat: validate file size

    const { url } = await this.uploader.upload({ body, fileName, fileType })

    const attachment = Attachment.create({
      title: fileName,
      url,
    })

    await this.attachmentsRepository.create(attachment)

    return right({
      attachment,
    })
  }
}
