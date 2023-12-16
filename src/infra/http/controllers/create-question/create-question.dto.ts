import { IsArray, IsNotEmpty, IsOptional } from 'class-validator'

export class CreateQuestionDTO {
  @IsNotEmpty()
  content!: string

  @IsNotEmpty()
  title!: string

  @IsOptional()
  @IsArray()
  attachmentsIds?: string[]
}
