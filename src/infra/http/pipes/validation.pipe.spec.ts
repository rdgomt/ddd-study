import { IsNotEmpty, IsString } from 'class-validator'
import { InvalidDataException } from '../exceptions/invalid-data.exception'
import { validateSyncObject } from './validation.pipe'

describe('ValidationPipe', () => {
  class TestObject {
    @IsNotEmpty()
    @IsString()
    id!: string

    constructor(object: Partial<TestObject>) {
      Object.assign(this, object)
    }
  }

  describe('validateSyncObject', () => {
    it('should return nothing if passed an valid object', () => {
      const object = new TestObject({
        id: '123',
      })

      expect(validateSyncObject(object)).toBeUndefined()
    })

    it('should throw an exception if the object could not be validated', () => {
      const object = new TestObject({
        id: 123 as unknown as string,
      })

      expect(() => validateSyncObject(object)).toThrowError(InvalidDataException)
    })
  })
})
