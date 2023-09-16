import { IsString } from 'class-validator'

export class EditAnswerDTO {
  @IsString()
  content!: string
}
