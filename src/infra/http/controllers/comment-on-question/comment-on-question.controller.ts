import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question'
import { AuthUser } from '@/infra/auth/auth-user.decorator'
import { BadRequestException, Body, Controller, Param, Post } from '@nestjs/common'
import { CommentOnQuestionDTO } from './comment-on-question.dto'

@Controller('/questions/:questionId/comments')
export class CommentOnQuestionController {
  constructor(private commentOnQuestion: CommentOnQuestionUseCase) {}

  @Post()
  async handle(
    @AuthUser('sub') authorId: string,
    @Param('questionId') questionId: string,
    @Body() body: CommentOnQuestionDTO,
  ) {
    const { content } = body

    const result = await this.commentOnQuestion.execute({
      authorId,
      content,
      questionId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
