import { AuthenticateStudentUseCase } from '@/domain/account/application/use-cases/authenticate-student'
import { RegisterStudentUseCase } from '@/domain/account/application/use-cases/register-student'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { GetRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/get-recent-questions'
import { Module } from '@nestjs/common'
import { CryptoModule } from '../crypto/crypto.module'
import { DatabaseModule } from '../database/database.module'
import { AuthenticateController } from './controllers/authenticate/authenticate.controller'
import { CreateAccountController } from './controllers/create-account/create-account.controller'
import { CreateQuestionController } from './controllers/create-question/create-question.controller'
import { GetRecentQuestionsController } from './controllers/get-recent-questions/get-recent-questions.controller'

@Module({
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    GetRecentQuestionsController,
  ],
  imports: [DatabaseModule, CryptoModule],
  providers: [CreateQuestionUseCase, GetRecentQuestionsUseCase, RegisterStudentUseCase, AuthenticateStudentUseCase],
})
export class HttpModule {}
