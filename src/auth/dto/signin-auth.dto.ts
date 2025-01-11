import { IsStrongPassword, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class SignInAuthDto {
  @ApiProperty({
    type: String,
    description: 'Email should be inputted',
    example: 'example@mail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: String,
    description: 'Password should be inputted',
    example: 'qwerty12345',
  })
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;
}
