import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Role } from '../../constants/roles';
export type UserDocument = HydratedDocument<User>;
@Schema()
export class User {
  @Prop({ type: String })
  fullname: string;
  @Prop({ type: String, unique: true, required: true })
  email: string;
  @Prop({ type: String, required: true })
  password: string;
  @Prop({ type: Boolean, default: false })
  is_active: boolean;
  @Prop({ type: String, default: Role.user })
  role: Role;
}
export const UserSchema = SchemaFactory.createForClass(User);
export type OtpDocument = HydratedDocument<OTP>;
@Schema({ timestamps: true })
export class OTP {
  @Prop({ type: Types.ObjectId, ref: 'users' })
  user_id: Types.ObjectId;
  @Prop({ type: String })
  otp_code: string;
}
export const OtpSchema = SchemaFactory.createForClass(OTP);
