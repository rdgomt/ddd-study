import { z } from 'zod'
import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { PrismaService } from '../prisma/prisma.service'

const pageQueryParameterSchema = z.string().optional().default('1').transform(Number).pipe(z.number().min(1))
const queryValidationPipe = new ZodValidationPipe(pageQueryParameterSchema)

type PageQueryParameterSchema = z.infer<typeof pageQueryParameterSchema>

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class GetRecentQuestionsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(@Query('page', queryValidationPipe) page: PageQueryParameterSchema) {
    const perPage = 20

    const questions = await this.prisma.question.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * perPage,
      take: perPage,
    })

    return { questions }
  }
}
