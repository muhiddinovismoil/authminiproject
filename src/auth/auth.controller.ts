import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpAuthDto } from './dto/signup-auth.dto';
import { SignInAuthDto } from './dto/signin-auth.dto';
import { AuthGuard } from '../guards/auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OtpAuthDto } from './dto/verifyotp-auth.dto';
@ApiTags('Users')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/signup')
  @ApiOperation({ summary: 'New user registration field' })
  @ApiBody({
    type: SignUpAuthDto,
    description: 'Information required for user registration',
    required: true,
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
  })
  @ApiResponse({
    status: 400,
    description: 'Registration failed',
  })
  async register(@Body() registerAuthDto: SignUpAuthDto) {
    return await this.authService.registerService(registerAuthDto);
  }
  @Post('/signin')
  @ApiConsumes('application/json')
  @ApiOperation({ summary: 'Login user after verifying otp and to get tokens' })
  @ApiBody({ type: SignInAuthDto })
  @ApiResponse({ status: 201, description: 'User successfully logged in' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'User account not verified' })
  @ApiResponse({
    status: 401,
    description: 'User password or email not suited',
  })
  async login(@Body() loginAuthDto: SignInAuthDto) {
    return await this.authService.loginService(loginAuthDto);
  }
  @Post('/verify')
  @ApiConsumes('application/json')
  @ApiOperation({ summary: 'Verification user account' })
  @ApiBody({ type: OtpAuthDto })
  @ApiResponse({ status: 201, description: 'User account activated' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 404, description: 'OTP not suit or maybe expired' })
  verifyOtp(@Body('email') email: string, @Body('otp_code') otp_code: string) {
    return this.authService.verification(email, otp_code);
  }
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get('/me/:id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The unique identifier of the user',
    example: '677c38235ee125532e470502',
  })
  @ApiResponse({ status: 200, description: 'User profile data outcome' })
  @ApiResponse({ status: 401, description: 'User not authorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  getProfile(@Param('id') id: string) {
    return this.authService.getProfile(id);
  }
}
