import {
  Body,
  ConflictException,
  Controller,
  Get,
  Post,
  UsePipes,
} from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { hash } from 'bcryptjs'
import { z } from 'zod'
import { ZodValidationPipe } from '@/pipes/zod-validation.pipe'

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

type IRequestCreateAccountDto = z.infer<typeof createAccountBodySchema>

@Controller('/accounts')
export class AccountsControllers {
  constructor(private prisma: PrismaService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async create(@Body() accountDto: IRequestCreateAccountDto) {
    const { email, name, password } = accountDto

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (userWithSameEmail)
      throw new ConflictException('User with same e-mail already exists.')

    const hashedPassword = await hash(password, 8)

    await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })
  }

  @Get()
  async index() {
    return await this.prisma.user.findMany()
  }
}
