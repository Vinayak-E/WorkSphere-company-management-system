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


export interface ICompanyService {
  signup(data: ICompanySignup): Promise<void>;
  verifyOTP(data: IVerifyOtpDto): Promise<void>;
  resendOTP(email: string): Promise<void>;
  login(email: string, password: string): Promise<{
    accessToken: string;
    refreshToken: string;
    company: {
      id: string;
      email: string;
      name: string;
    };
  }>;
  refreshToken(refreshToken: string): Promise<{ accessToken: string }>;
}

export interface ICompanyRepository {
  create(company: ICompanySignup): Promise<ICompanyDocument>;
  findByEmail(email: string): Promise<ICompanyDocument | null>;
  update(id: string, data: Partial<ICompanyDocument>): Promise<ICompanyDocument | null>;
  updateOTP(email: string, otp: string, otpExpiry: Date): Promise<void>; 
  saveRefreshToken(companyId: string, token: string): Promise<void>;
  verifyRefreshToken(companyId: string, token: string): Promise<boolean>;

}

