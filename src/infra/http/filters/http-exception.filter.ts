/* eslint-disable perfectionist/sort-objects */
import { now } from '@/utils/date/now'
import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common'
import { IRequest } from '../interfaces/request.interface'
import { IResponse } from '../interfaces/response.interface'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp()
    const response = context.getResponse<IResponse>()
    const request = context.getRequest<IRequest>()
    const status = exception.getStatus()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
    const { meta } = exception.getResponse() as any

    response.status(status).json({
      statusCode: status,
      method: request.method,
      path: request.url,
      message: exception.message,
      timestamp: now().toISOString(),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,
      meta,
    })
  }
}
