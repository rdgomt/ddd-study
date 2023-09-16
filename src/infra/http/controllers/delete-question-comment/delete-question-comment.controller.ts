import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases/delete-question-comment'
import { AuthUser } from '@/infra/auth/auth-user.decorator'
import { BadRequestException, Controller, Delete, HttpCode, HttpStatus, Param } from '@nestjs/common'

@Controller('/questions/comments/:questionCommentId')
export class DeleteQuestionCommentController {
  constructor(private deleteQuestionComment: DeleteQuestionCommentUseCase) {}

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(@AuthUser('sub') authorId: string, @Param('questionCommentId') questionCommentId: string) {
    const result = await this.deleteQuestionComment.execute({
      authorId,
      questionCommentId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
