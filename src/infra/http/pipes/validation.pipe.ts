import { validateSync, ValidationError, ValidatorOptions } from 'class-validator'
import { ValidationPipe, ValidationPipeOptions } from '@nestjs/common'
import { InvalidDataException } from '../exceptions/invalid-data.exception'

const validatorOptions: ValidatorOptions = {
  forbidNonWhitelisted: false,
  stopAtFirstError: true,
  whitelist: true,
}

const validationPipeOptions: ValidationPipeOptions = {
  ...validatorOptions,
  exceptionFactory: (errors: ValidationError[]) => {
    throw new InvalidDataException(errors)
  },
  transform: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
}

export const validateSyncObject = (object: object): InvalidDataException | undefined => {
  const errors = validateSync(object, validatorOptions)

  if (errors.length > 0) {
    throw new InvalidDataException(errors)
  }

  return undefined
}

export const validationPipe = new ValidationPipe(validationPipeOptions)
