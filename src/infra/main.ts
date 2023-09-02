import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { EnvService } from './env/env.service'
import { HttpExceptionFilter } from './http/filters/http-exception.filter'
import { PrismaClientKnowRequestExceptionFilter } from './http/filters/prisma-client-know-request-exception.filter'
import { loggerMiddleware } from './http/middlewares/logger.middleware'
import { validationPipe } from './http/pipes/validation.pipe'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // TODO: feat: enable cors and helmet
  // app.enableCors()
  // app.use(helmet())
  app.use(loggerMiddleware)
  app.useGlobalPipes(validationPipe)
  app.useGlobalFilters(new HttpExceptionFilter(), new PrismaClientKnowRequestExceptionFilter())

  const configService = app.get(EnvService)
  const port = configService.get('PORT')

  await app.listen(port, () => console.log(`🚀 App is listening on port ${port}.`))
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises, unicorn/prefer-top-level-await
bootstrap()
