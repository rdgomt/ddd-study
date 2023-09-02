import { now } from '@/utils/date/now'
import { INextFunction } from '../interfaces/next-function.interface'
import { IRequest } from '../interfaces/request.interface'
import { IResponse } from '../interfaces/response.interface'

export function loggerMiddleware(request: IRequest, _response: IResponse, next: INextFunction) {
  console.log(`${now().toISOString()} ${request.method} ${request.url}`)

  next()
}
