export interface IAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface ICompanySignup {
  companyName: string;
  email: string;
  password: string;
  phone: string;
}

export interface ICompanyDocument extends Document {
  _id: string;
  companyName: string;
  email: string;
  password: string;
  phone: string;
  role: string;
  address?: IAddress;
  isEmailVerified: boolean;
  isActive: boolean;
  otp?: string;
  otpExpiry?: Date;
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

}

export interface ICompanyRepository {
  createCompany(company: ICompanySignup): Promise<string | null>;
  findByEmail(email: string): Promise<ICompanyDocument | null>;
  
 
}

export interface IOtpRepository {
  storeOtp(email: string, otp: string): Promise<void>;
  verifyOtp(email: string, otp: string): Promise<boolean>; 
}
