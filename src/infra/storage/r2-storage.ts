import { randomUUID } from 'node:crypto'
import { Uploader, UploadParams } from '@/domain/forum/application/storage/uploader'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'
import { EnvService } from '../env/env.service'

@Injectable()
export class R2Storage implements Uploader {
  private client: S3Client

  constructor(private env: EnvService) {
    const accountId = env.get('CLOUDFLARE_ACCOUNT_ID')

    this.client = new S3Client({
      credentials: {
        accessKeyId: env.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: env.get('AWS_SECRET_ACCESS_KEY'),
      },
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      region: 'auto',
    })
  }

  async upload({ body, fileName, fileType }: UploadParams): Promise<{ url: string }> {
    const uploadId = randomUUID()
    const uniqueFileName = `${uploadId}-${fileName}`

    await this.client.send(
      new PutObjectCommand({
        Body: body,
        Bucket: this.env.get('AWS_BUCKET_NAME'),
        ContentType: fileType,
        Key: uniqueFileName,
      }),
    )

    return {
      url: uniqueFileName,
    }
  }
}
