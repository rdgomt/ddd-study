import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { AuthUser } from '@/infra/auth/auth-user.decorator'
import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { CreateQuestionDTO } from './create-question.dto'

@Controller('/questions')
export class CreateQuestionController {
  constructor(private createQuestion: CreateQuestionUseCase) {}

  @Post()
  async handle(@Body() body: CreateQuestionDTO, @AuthUser('sub') authorId: string) {
    const { attachmentsIds, content, title } = body

    const result = await this.createQuestion.execute({
      attachmentsIds,
      authorId,
      content,
      title,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
