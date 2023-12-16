import { AuthenticateStudentUseCase } from '@/domain/account/application/use-cases/authenticate-student'
import { RegisterStudentUseCase } from '@/domain/account/application/use-cases/register-student'
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'
import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-question-best-answer'
import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer'
import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer'
import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment'
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question'
import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases/delete-question-comment'
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer'
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'
import { GetAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/get-answer-comments'
import { GetQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/get-question-answers'
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug'
import { GetQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/get-question-comments'
import { GetRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/get-recent-questions'
import { UploadAndCreateAttachmentUseCase } from '@/domain/forum/application/use-cases/upload-and-create-attachment'
import { Module } from '@nestjs/common'
import { CryptoModule } from '../crypto/crypto.module'
import { DatabaseModule } from '../database/database.module'
import { StorageModule } from '../storage/storage.module'
import { AnswerQuestionController } from './controllers/answer-question/answer-question.controller'
import { AuthenticateController } from './controllers/authenticate/authenticate.controller'
import { ChooseQuestionBestAnswerController } from './controllers/choose-question-best-answer/choose-question-best-answer.controller'
import { CommentOnAnswerController } from './controllers/comment-on-answer/comment-on-answer.controller'
import { CommentOnQuestionController } from './controllers/comment-on-question/comment-on-question.controller'
import { CreateAccountController } from './controllers/create-account/create-account.controller'
import { CreateQuestionController } from './controllers/create-question/create-question.controller'
import { DeleteAnswerCommentController } from './controllers/delete-answer-comment/delete-answer-comment.controller'
import { DeleteAnswerController } from './controllers/delete-answer/delete-answer.controller'
import { DeleteQuestionCommentController } from './controllers/delete-question-comment/delete-question-comment.controller'
import { DeleteQuestionController } from './controllers/delete-question/delete-question.controller'
import { EditAnswerController } from './controllers/edit-answer/edit-answer.controller'
import { EditQuestionController } from './controllers/edit-question/edit-question.controller'
import { GetAnswerCommentsController } from './controllers/get-answer-comments/get-answer-comments.controller'
import { GetQuestionAnswersController } from './controllers/get-question-answers/get-question-answers.controller'
import { GetQuestionBySlugController } from './controllers/get-question-by-slug/get-question-by-slug.controller'
import { GetQuestionCommentsController } from './controllers/get-question-comments/get-question-comments.controller'
import { GetRecentQuestionsController } from './controllers/get-recent-questions/get-recent-questions.controller'
import { UploadAttachmentController } from './controllers/upload-attachment/upload-attachment.controller'

@Module({
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    GetRecentQuestionsController,
    GetQuestionBySlugController,
    EditQuestionController,
    DeleteQuestionController,
    AnswerQuestionController,
    EditAnswerController,
    DeleteAnswerController,
    GetQuestionAnswersController,
    ChooseQuestionBestAnswerController,
    CommentOnQuestionController,
    DeleteQuestionCommentController,
    CommentOnAnswerController,
    DeleteAnswerCommentController,
    GetQuestionCommentsController,
    GetAnswerCommentsController,
    UploadAttachmentController,
  ],
  imports: [DatabaseModule, CryptoModule, StorageModule],
  providers: [
    CreateQuestionUseCase,
    GetRecentQuestionsUseCase,
    RegisterStudentUseCase,
    AuthenticateStudentUseCase,
    GetQuestionBySlugUseCase,
    EditQuestionUseCase,
    DeleteQuestionUseCase,
    AnswerQuestionUseCase,
    EditAnswerUseCase,
    DeleteAnswerUseCase,
    GetQuestionAnswersUseCase,
    ChooseQuestionBestAnswerUseCase,
    CommentOnQuestionUseCase,
    DeleteQuestionCommentUseCase,
    CommentOnAnswerUseCase,
    DeleteAnswerCommentUseCase,
    GetQuestionCommentsUseCase,
    GetAnswerCommentsUseCase,
    UploadAndCreateAttachmentUseCase,
  ],
})
export class HttpModule {}
