/* eslint-disable perfectionist/sort-objects */
import { now } from '@/utils/date/now'
import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { IRequest } from '../interfaces/request.interface'
import { IResponse } from '../interfaces/response.interface'

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientKnowRequestExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const context = host.switchToHttp()
    const response = context.getResponse<IResponse>()
    const request = context.getRequest<IRequest>()
    const { method } = request
    const { path } = request
    const timestamp = now().toISOString()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    const meta = exception.meta as any
    const internalCode = exception.code
    let message = exception.message.replaceAll('\n', '')
    let statusCode

    switch (exception.code) {
      case 'P2002': {
        statusCode = HttpStatus.CONFLICT
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-template-expressions
        message = `${meta.target[0]} already exists.`

        break
      }

      case 'P2025': {
        statusCode = HttpStatus.NOT_FOUND
        message = `Record not found.`

        break
      }

      default: {
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR
        message = 'Internal server error.'
      }

      // TODO: feat: catch other error codes
    }

    response.status(statusCode).json({
      statusCode,
      internalCode,
      method,
      path,
      message,
      timestamp,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      meta,
    })
  }
}
