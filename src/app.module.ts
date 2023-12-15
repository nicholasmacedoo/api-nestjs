import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaService } from './prisma/prisma.service'
import { AccountsControllers } from './controllers/users.controller'
import { envSchema } from './env'
import { AuthModule } from './domains/auth/auth.module'
import { AuthenticateControllers } from './controllers/authenticate.controller'
import { QuestionControllers } from './controllers/question.controller'
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [
    AccountsControllers,
    AuthenticateControllers,
    QuestionControllers,
    FetchRecentQuestionsController,
  ],
  providers: [PrismaService],
})
export class AppModule {}
