import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator'

export class CreateAccountDTO {
  @IsEmail()
  @IsNotEmpty()
  email!: string

  @IsNotEmpty()
  name!: string

  @IsStrongPassword()
  @IsNotEmpty()
  password!: string
}
