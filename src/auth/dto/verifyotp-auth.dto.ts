import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class OtpAuthDto {
  @ApiProperty({
    type: String,
    description: 'User email should be inputted',
    example: 'example@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: String,
    description: 'OTP code should be inputted',
    example: 'sREs2R',
  })
  @IsNotEmpty()
  otp_code: string;
}
