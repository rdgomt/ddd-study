/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable perfectionist/sort-objects */
import { ZodError, ZodSchema } from 'zod'
import { fromZodError } from 'zod-validation-error'
import { BadRequestException, HttpStatus, PipeTransform } from '@nestjs/common'

const MESSAGE = 'Validation failed.'

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      return this.schema.parse(value)
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: MESSAGE,
          errors: fromZodError(error),
        })
      }

      throw new BadRequestException(MESSAGE)
    }

    return value
  }
}
