import { IsNotEmpty } from 'class-validator'

export class EditQuestionDTO {
  @IsNotEmpty()
  content!: string

  @IsNotEmpty()
  title!: string
}
