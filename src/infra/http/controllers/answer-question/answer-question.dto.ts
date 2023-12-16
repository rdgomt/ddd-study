import { IsArray, IsOptional, IsString } from 'class-validator'

export class AnswerQuestionDTO {
  @IsString()
  content!: string

  @IsArray()
  @IsOptional()
  attachmentsIds?: string[]
}
