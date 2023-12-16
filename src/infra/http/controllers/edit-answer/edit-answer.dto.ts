import { IsArray, IsOptional, IsString } from 'class-validator'

export class EditAnswerDTO {
  @IsString()
  content!: string

  @IsOptional()
  @IsArray()
  attachmentsIds?: string[]
}
