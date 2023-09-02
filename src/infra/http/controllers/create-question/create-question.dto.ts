import { IsNotEmpty, IsString } from 'class-validator'

export class CreateQuestionDTO {
  @IsString()
  @IsNotEmpty()
  content!: string

  @IsString()
  @IsNotEmpty()
  title!: string
}
