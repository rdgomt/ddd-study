import { IsNotEmpty } from 'class-validator'

export class CreateQuestionDTO {
  @IsNotEmpty()
  content!: string

  @IsNotEmpty()
  title!: string
}
