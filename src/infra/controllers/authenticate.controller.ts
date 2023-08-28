import { compare } from 'bcryptjs'
import { z } from 'zod'
import { Body, Controller, Post, UnauthorizedException, UsePipes } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { PrismaService } from '../prisma/prisma.service'

const CREDENTIALS_ERROR_MESSAGE = 'User credentials do not match.'

const authenticateSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type AuthenticateDTO = z.infer<typeof authenticateSchema>

@Controller('/sessions')
@UsePipes(new ZodValidationPipe(authenticateSchema))
export class AuthenticateController {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  @Post()
  async handle(@Body() body: AuthenticateDTO) {
    const { email, password } = body

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      throw new UnauthorizedException(CREDENTIALS_ERROR_MESSAGE)
    }

    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid) {
      throw new UnauthorizedException(CREDENTIALS_ERROR_MESSAGE)
    }

    const accessToken = this.jwt.sign({ sub: user.id })

    return {
      accessToken,
    }
  }
}
