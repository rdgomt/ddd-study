import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class AuthenticateDTO {
  @IsEmail()
  @IsNotEmpty()
  email!: string

  @IsString()
  @IsNotEmpty()
  password!: string
}
