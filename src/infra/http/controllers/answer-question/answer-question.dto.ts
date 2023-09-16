import { IsString } from 'class-validator'

export class AnswerQuestionDTO {
  @IsString()
  content!: string
}
