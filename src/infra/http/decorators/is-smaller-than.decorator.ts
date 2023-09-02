import { registerDecorator, ValidationOptions } from 'class-validator'

export function IsSmallerThan(threshold: number, validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      constraints: [threshold],
      name: 'isSmallerThan',
      options: {
        ...validationOptions,
        message: validationOptions?.message || `${propertyName} must be smaller than ${threshold}`,
      },
      propertyName,
      target: object.constructor,
      validator: {
        validate(value: unknown) {
          return typeof value === 'number' && value < threshold
        },
      },
    })
  }
}
