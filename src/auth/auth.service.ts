import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { MailerService } from '@nestjs-modules/mailer';
import { SignUpAuthDto } from './dto/signup-auth.dto';
import { SignInAuthDto } from './dto/signin-auth.dto';
import { OTP, User } from './entities/auth.entity';
import { comparePassword, generateHash } from '../helpers/hashpass';
import { generateOtp } from '../helpers/otp';
import { sendEmail } from '../helpers/sendMail';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('users') private usersModel: Model<User>,
    @InjectModel('otp') private otpModel: Model<OTP>,
    private jwtService: JwtService,
    private readonly mailHelper: MailerService,
  ) {}
  async registerService(registerAuthDto: SignUpAuthDto) {
    try {
      const userdata = await this.usersModel.findOne({
        email: registerAuthDto.email,
      });
      if (!userdata) {
        const newUser = new this.usersModel({
          ...registerAuthDto,
          password: await generateHash(registerAuthDto.password),
        });
        await newUser.save();
        const otp = await generateOtp();
        await sendEmail(
          this.mailHelper,
          registerAuthDto.email,
          'Welcome to Our Platform',
          'Thank you for registering!',
          `<h1>Welcome!</h1><p>We are glad to have you on board.<br>Here is your otp code and don't give it to others please: <b>${otp}</b></p>`,
        );
        const otpCode = new this.otpModel({
          user_id: newUser._id,
          otp_code: otp,
        });
        await otpCode.save();
        return {
          message: 'Register was successfull',
          registeredUserId: newUser._id,
        };
      }
      throw new BadRequestException('Registration failed');
    } catch (error) {
      return error;
    }
  }

  async loginService(loginAuthDto: SignInAuthDto) {
    try {
      const getUser = await this.usersModel.findOne({
        email: loginAuthDto.email,
      });
      if (!getUser) {
        throw new NotFoundException('User not found');
      }
      if (getUser.is_active == false) {
        throw new BadRequestException('Your account not verified');
      }
      const isPasswordEqual = await comparePassword(
        loginAuthDto.password,
        getUser.password,
      );
      if (!isPasswordEqual) {
        throw new UnauthorizedException('Your password or email not suit');
      }
      const payload = {
        sub: getUser.id,
        email: getUser.email,
        fullname: getUser.fullname,
        role: getUser.role,
      };
      const payload2 = {
        sub: getUser.id,
        email: getUser.email,
        fullname: getUser.fullname,
      };
      return {
        message: 'You are logged in successfully',
        accessToken: await this.jwtService.signAsync(payload),
        refreshToken: await this.jwtService.signAsync(payload2),
      };
    } catch (error) {
      return error;
    }
  }

  async verification(email: string, otp_code: string) {
    try {
      const getUser = await this.usersModel.findOne({ email: email });
      if (!getUser) {
        throw new NotFoundException('User not found');
      }
      const getOtp = await this.otpModel.findOne({ user_id: getUser._id });
      if (!getOtp) {
        throw new NotFoundException('Otp not found or maybe already expired');
      }
      if (otp_code == getOtp.otp_code) {
        await this.usersModel.updateOne(
          { email: email },
          { $set: { is_active: true } },
        );
        await this.otpModel.deleteOne({ user_id: getUser._id });
        return {
          message: 'Your account is now activated',
        };
      }
      throw new BadRequestException('Your otp is not suit');
    } catch (error) {
      throw new Error(error);
    }
  }

  async getProfile(id: string) {
    try {
      const getUser = await this.usersModel
        .findOne({ _id: id })
        .select('-password');
      if (!getUser) {
        throw new NotFoundException('User not found');
      }
      return {
        message: 'OK',
        userProfile: getUser,
      };
    } catch (error) {
      return error;
    }
  }
}
