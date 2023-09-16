import { Type } from 'class-transformer'
import { IsInt, IsOptional } from 'class-validator'
import { IsGreaterThan } from '../../decorators/is-greater-than.decorator'

export class GetQuestionAnswersQueryParams {
  @IsOptional()
  @IsInt()
  @IsGreaterThan(0)
  @Type(() => Number)
  page = 1
}
