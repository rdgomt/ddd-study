import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer'
import { AuthUser } from '@/infra/auth/auth-user.decorator'
import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Param, Put } from '@nestjs/common'
import { EditAnswerDTO } from './edit-answer.dto'

@Controller('/answers/:answerId')
export class EditAnswerController {
  constructor(private editAnswer: EditAnswerUseCase) {}

  @Put()
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(@AuthUser('sub') authorId: string, @Param('answerId') answerId: string, @Body() body: EditAnswerDTO) {
    const { content } = body

    const result = await this.editAnswer.execute({
      answerId,
      attachmentsIds: [],
      authorId,
      content,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
