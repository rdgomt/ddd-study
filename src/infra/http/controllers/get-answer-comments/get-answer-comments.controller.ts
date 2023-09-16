import { GetAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/get-answer-comments'
import { BadRequestException, Controller, Get, Param, Query } from '@nestjs/common'
import { CommentPresenter } from '../../presenters/comment.presenter'
import { GetAnswerCommentsQueryParams } from './get-answer-comments-query-params'

@Controller('/answers/:answerId/comments')
export class GetAnswerCommentsController {
  constructor(private getAnswerComments: GetAnswerCommentsUseCase) {}

  @Get()
  async handle(@Param('answerId') answerId: string, @Query() { page = 1 }: GetAnswerCommentsQueryParams) {
    const result = await this.getAnswerComments.execute({
      answerId,
      pagination: {
        page,
      },
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { answerComments } = result.value

    return { comments: answerComments.map((answerComment) => CommentPresenter.present(answerComment)) }
  }
}
