import { registerDecorator, ValidationOptions } from 'class-validator'

export function IsGreaterThan(threshold: number, validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      constraints: [threshold],
      name: 'isGreaterThan',
      options: {
        ...validationOptions,
        message: validationOptions?.message || `${propertyName} must be greater than ${threshold}`,
      },
      propertyName,
      target: object.constructor,
      validator: {
        validate(value: unknown) {
          return typeof value === 'number' && value > threshold
        },
      },
    })
  }
}
