import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { AuthUser } from '@/infra/auth/auth-user.decorator'
import { AuthUserPayload } from '@/infra/auth/jwt.strategy'
import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { CreateQuestionDTO } from './create-question.dto'

@Controller('/questions')
export class CreateQuestionController {
  constructor(private createQuestion: CreateQuestionUseCase) {}

  @Post()
  async handle(@Body() body: CreateQuestionDTO, @AuthUser() user: AuthUserPayload) {
    const { content, title } = body
    const authorId = user.sub

    const result = await this.createQuestion.execute({
      authorId,
      content,
      title,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
