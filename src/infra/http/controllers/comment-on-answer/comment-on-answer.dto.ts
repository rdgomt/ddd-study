import { IsNotEmpty } from 'class-validator'

export class CommentOnAnswerDTO {
  @IsNotEmpty()
  content!: string
}
