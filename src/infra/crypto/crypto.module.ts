import { Encrypter } from '@/core/crypto/encrypter'
import { HashComparer } from '@/core/crypto/hash-comparer'
import { HashGenerator } from '@/core/crypto/hash-generator'
import { Module } from '@nestjs/common'
import { BcryptHasher } from './bcrypt-hasher'
import { JwtEncrypter } from './jwt-encrypter'

@Module({
  exports: [Encrypter, HashComparer, HashGenerator],
  providers: [
    { provide: Encrypter, useClass: JwtEncrypter },
    { provide: HashComparer, useClass: BcryptHasher },
    { provide: HashGenerator, useClass: BcryptHasher },
  ],
})
export class CryptoModule {}
