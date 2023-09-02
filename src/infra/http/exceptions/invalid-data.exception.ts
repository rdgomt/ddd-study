import { ValidationError } from 'class-validator'
import { HttpException, HttpStatus } from '@nestjs/common'

export class InvalidDataException extends HttpException {
  constructor(errors: ValidationError[]) {
    const message = errors[0]?.constraints?.[Object.keys(errors[0]?.constraints)[0] || '']

    super({ message, meta: errors }, HttpStatus.BAD_REQUEST)
  }
}
