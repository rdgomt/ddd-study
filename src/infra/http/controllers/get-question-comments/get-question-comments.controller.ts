import { GetQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/get-question-comments'
import { BadRequestException, Controller, Get, Param, Query } from '@nestjs/common'
import { CommentWithAuthorPresenter } from '../../presenters/comment-with-author.presenter'
import { GetQuestionCommentsQueryParams } from './get-question-comments-query-params'

@Controller('/questions/:questionId/comments')
export class GetQuestionCommentsController {
  constructor(private getQuestionComments: GetQuestionCommentsUseCase) {}

  @Get()
  async handle(@Param('questionId') questionId: string, @Query() { page = 1 }: GetQuestionCommentsQueryParams) {
    const result = await this.getQuestionComments.execute({
      pagination: {
        page,
      },
      questionId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { comments } = result.value

    return { comments: comments.map((comment) => CommentWithAuthorPresenter.toHTTP(comment)) }
  }
}
