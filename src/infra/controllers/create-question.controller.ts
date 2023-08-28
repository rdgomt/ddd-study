import { z } from 'zod'
import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { CurrentUser } from '../auth/current-user.decorator'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CurrentUserPayload } from '../auth/jwt.strategy'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { PrismaService } from '../prisma/prisma.service'

const createQuestionSchema = z.object({
  content: z.string(),
  title: z.string(),
})

type CreateQuestionDTO = z.infer<typeof createQuestionSchema>

const bodyValidationPipe = new ZodValidationPipe(createQuestionSchema)

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(@Body(bodyValidationPipe) body: CreateQuestionDTO, @CurrentUser() user: CurrentUserPayload) {
    const { content, title } = body
    const userId = user.sub
    const slug = this.convertToSlug(title)

    await this.prisma.question.create({
      data: {
        authorId: userId,
        content,
        slug,
        title,
      },
    })
  }

  private convertToSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replaceAll(/[\u0300-\u036F]/g, '')
      .replaceAll(/[^\s\w-]/g, '')
      .replaceAll(/\s+/g, '-')
  }
}
