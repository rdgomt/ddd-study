import { hash } from 'bcryptjs'
import { z } from 'zod'
import { Body, ConflictException, Controller, Post, UsePipes } from '@nestjs/common'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { PrismaService } from '../prisma/prisma.service'

const PASSWORD_HASH_SALT_LENGTH = 8

const createAccountSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  password: z.string(),
})

type CreateAccountDTO = z.infer<typeof createAccountSchema>

@Controller('/accounts')
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createAccountSchema))
  async handle(@Body() body: CreateAccountDTO) {
    const { email, name, password } = createAccountSchema.parse(body)

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (userWithSameEmail) {
      throw new ConflictException('User with same e-mail address already exists.')
    }

    const hashedPassword = await hash(password, PASSWORD_HASH_SALT_LENGTH)

    await this.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    })
  }
}
