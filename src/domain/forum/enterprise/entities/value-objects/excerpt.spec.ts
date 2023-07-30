import { faker } from '@faker-js/faker'
import { Excerpt } from './excerpt'

let excerpt: Excerpt

describe('Excerpt', () => {
  beforeAll(() => {
    excerpt = new Excerpt(faker.lorem.paragraphs(5))
  })

  it('should be a string with of 123 characters at max', () => {
    expect(excerpt.value.length).toBeLessThanOrEqual(123)
  })

  it('should be a string ending with "..."', () => {
    expect(excerpt.value.slice(-3)).toEqual('...')
  })
})
