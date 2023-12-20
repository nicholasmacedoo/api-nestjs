import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { CurrentUser } from '@/domains/auth/current-user-decorator'
import { UserPayload } from '@/domains/auth/jwt.strategy'
import { ZodValidationPipe } from '@/pipes/zod-validation.pipe'
import { PrismaService } from '@/prisma/prisma.service'
import { z } from 'zod'

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

type IRequestCreateQuestionDto = z.infer<typeof createQuestionBodySchema>

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema)

@Controller('/questions')
@UseGuards(AuthGuard('jwt'))
export class QuestionControllers {
  constructor(private prisma: PrismaService) {}

  @Post()
  async create(
    @Body(bodyValidationPipe) body: IRequestCreateQuestionDto,
    @CurrentUser() user: UserPayload,
  ) {
    const { title, content } = body
    const { sub: userId } = user
    const slug = this.convertToSlug(title)

    await this.prisma.question.create({
      data: {
        authorId: userId,
        title,
        content,
        slug,
      },
    })
  }

  private convertToSlug(input: string): string {
    // Normalize the string to remove accents and normalize Unicode characters
    const normalizedString = input.normalize('NFKD')

    return normalizedString
      .replace(/[^\w\s-]/g, '') // Remove non-word characters
      .trim() // Trim leading and trailing whitespaces
      .toLowerCase() // Convert to lowercase
      .replace(/[-\s]+/g, '-') // Replace spaces and consecutive dashes with a single dash
  }
}
