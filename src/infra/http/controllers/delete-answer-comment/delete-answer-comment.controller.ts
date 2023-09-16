import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment'
import { AuthUser } from '@/infra/auth/auth-user.decorator'
import { BadRequestException, Controller, Delete, HttpCode, HttpStatus, Param } from '@nestjs/common'

@Controller('/answers/comments/:answerCommentId')
export class DeleteAnswerCommentController {
  constructor(private deleteAnswerComment: DeleteAnswerCommentUseCase) {}

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(@AuthUser('sub') authorId: string, @Param('answerCommentId') answerCommentId: string) {
    const result = await this.deleteAnswerComment.execute({
      answerCommentId,
      authorId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
