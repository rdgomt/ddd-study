import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer'
import { AuthUser } from '@/infra/auth/auth-user.decorator'
import { BadRequestException, Body, Controller, Param, Post } from '@nestjs/common'
import { CommentOnAnswerDTO } from './comment-on-answer.dto'

@Controller('/answers/:answerId/comments')
export class CommentOnAnswerController {
  constructor(private commentOnAnswer: CommentOnAnswerUseCase) {}

  @Post()
  async handle(
    @AuthUser('sub') authorId: string,
    @Param('answerId') answerId: string,
    @Body() body: CommentOnAnswerDTO,
  ) {
    const { content } = body

    const result = await this.commentOnAnswer.execute({
      answerId,
      authorId,
      content,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
