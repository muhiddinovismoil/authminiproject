import { PartialType } from '@nestjs/swagger';
import { SignUpAuthDto } from './signup-auth.dto';

export class UpdateAuthDto extends PartialType(SignUpAuthDto) {}
