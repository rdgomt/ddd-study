import { HashComparer } from '@/core/crypto/hash-comparer'
import { HashGenerator } from '@/core/crypto/hash-generator'

export class FakeHasher implements HashGenerator, HashComparer {
  private readonly suffix = '-hashed'

  async hash(plain: string): Promise<string> {
    return `${plain}${this.suffix}`
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return `${plain}${this.suffix}` === hash
  }
}
