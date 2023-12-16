import { IsArray, IsNotEmpty, IsOptional } from 'class-validator'

export class EditQuestionDTO {
  @IsNotEmpty()
  content!: string

  @IsNotEmpty()
  title!: string

  @IsOptional()
  @IsArray()
  attachmentsIds?: string[]
}
