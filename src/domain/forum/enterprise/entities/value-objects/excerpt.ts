const EXCERPT_MAX_LENGTH = 120

export class Excerpt {
  public readonly value: string

  constructor(content: string) {
    this.value = `${content.slice(0, EXCERPT_MAX_LENGTH).trimEnd()}...`
  }
}
