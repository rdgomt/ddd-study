import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator'

export class CreateAccountDTO {
  @IsEmail()
  @IsNotEmpty()
  email!: string

  @IsString()
  @IsNotEmpty()
  name!: string

  @IsStrongPassword()
  @IsNotEmpty()
  password!: string
}
