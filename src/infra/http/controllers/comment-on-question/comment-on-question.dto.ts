import { IsNotEmpty } from 'class-validator'

export class CommentOnQuestionDTO {
  @IsNotEmpty()
  content!: string
}
