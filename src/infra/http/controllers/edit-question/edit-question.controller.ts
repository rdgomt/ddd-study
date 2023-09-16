import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'
import { AuthUser } from '@/infra/auth/auth-user.decorator'
import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Param, Put } from '@nestjs/common'
import { EditQuestionDTO } from './edit-question.dto'

@Controller('/questions/:questionId')
export class EditQuestionController {
  constructor(private editQuestion: EditQuestionUseCase) {}

  @Put()
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(
    @AuthUser('sub') authorId: string,
    @Param('questionId') questionId: string,
    @Body() body: EditQuestionDTO,
  ) {
    const { content, title } = body

    const result = await this.editQuestion.execute({
      attachmentsIds: [],
      authorId,
      content,
      questionId,
      title,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
