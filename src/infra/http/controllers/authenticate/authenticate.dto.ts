import { IsEmail, IsNotEmpty } from 'class-validator'

export class AuthenticateDTO {
  @IsEmail()
  @IsNotEmpty()
  email!: string

  @IsNotEmpty()
  password!: string
}
