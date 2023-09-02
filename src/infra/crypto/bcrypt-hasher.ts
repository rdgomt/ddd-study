import { compare, hash } from 'bcryptjs'
import { HashComparer } from '@/core/crypto/hash-comparer'
import { HashGenerator } from '@/core/crypto/hash-generator'

export class BcryptHasher implements HashGenerator, HashComparer {
  private HASH_SALT_LENGTH = 8

  hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGTH)
  }

  compare(plain: string, hashToCompare: string): Promise<boolean> {
    return compare(plain, hashToCompare)
  }
}
