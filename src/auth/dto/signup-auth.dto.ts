import {
  IsString,
  IsStrongPassword,
  IsEmail,
  IsNotEmpty,
  IsEnum,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../constants/roles';
export class SignUpAuthDto {
  @ApiProperty({
    type: String,
    description: 'Fullname should be written',
    example: 'Ali Valiyev',
  })
  @IsString()
  @IsNotEmpty()
  fullname: string;

  @ApiProperty({
    type: String,
    description: 'Email should be written',
    example: 'example@mail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: String,
    description: 'Password should be written',
    example: 'qwerty12345',
  })
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    type: String,
    description: 'There would be role for visitors',
    default: Role.user,
  })
  @IsOptional()
  @IsEnum(Role)
  role: Role;

  @ApiProperty({
    type: String,
    description: 'There would be role for visitors',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  is_active: boolean;
}
