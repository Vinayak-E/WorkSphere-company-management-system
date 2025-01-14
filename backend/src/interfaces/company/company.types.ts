import { ObjectId } from "mongoose";
import { IUser } from "../IUser.types";

export interface IAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface ICompanySignup {
  companyName: string | null;
  email: string;
  password: string ;
  phone: string | null;
  userId?: string
}

export interface ICreateCompany {
  userId: string;
  companyName: string | null;
  phone: string | null;
  email: string;
}
export interface IGoogleSignup {
  email: string;
  googleId: string;
}

export interface ICompanyDocument extends Document {
  _id: string;
  companyName: string;
  email: string;
  password: string;
  phone: string;
  userId : ObjectId
  address?: IAddress;
  isActive: boolean;
 
  role:string
 
  logo?: string;
  industry?: string;
  description?: string;
  subscriptionPlan?: string;
  subscriptionStatus?: 'active' | 'inactive' | 'expired';
  subscriptionExpiry?: Date;
  lastLogin?: Date;
  refreshToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  createdAt: Date;
  updatedAt: Date;

  comparePassword(candidatePassword: string): Promise<boolean>;
  hasValidSubscription(): boolean;
}

export interface IVerifyOtpDto {
  email: string;
  otp: string;
}

export interface ICompanyUser {
  _id: string;
  email: string;
  role: string;
 
}

export interface ICompanyService {
  signup(data: ICompanySignup): Promise<string | boolean | null>;
  verifyOtp(data: IVerifyOtpDto): Promise<boolean>; 
  verifyLogin(email:string,password:string):Promise<ICompanyUser |null>
  generateOtp(email: string): Promise<any>
  generateAccessToken(userId: string): Promise<string>
  verifyRefreshToken(refreshToken: string): Promise<string | null>
  sendResetLink(email: string): Promise<boolean | null>
  resetPassword(email: string, password: string): Promise<void>
  findOrCreateCompany(profile: any): Promise<any>

}

export interface ICompanyRepository {
  createCompany(company: ICreateCompany, options?: any): Promise<ICompanyDocument |null>;
  findByEmail(email: string): Promise<IUser| null>;
  storeResetToken(email: string, resetToken: string, tokenExpiry: Date):any
  resetPassword(email: string, password: string): Promise<void>

}

export interface IOtpRepository {
  storeOtp(email: string, otp: string): Promise<void>;
  verifyOtp(email: string, otp: string): Promise<boolean>; 
}
