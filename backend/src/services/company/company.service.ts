  import { IUserRepository } from "../../interfaces/IUser.types";
import {ICompanySignup,IVerifyOtpDto,ICompanyService,ICompanyRepository, IOtpRepository ,ICompanyUser} from "../../interfaces/company/company.types";
  import { sendEmail,sendResetEmail} from "../../utils/email"; 
  import {generateOTP} from "../../utils/otp"
  import bcrypt from "bcryptjs"
  import jwt from "jsonwebtoken";
  


  export class CompanyService implements ICompanyService {

    constructor(
      private readonly companyRepository: ICompanyRepository,
      private readonly otpRepository: IOtpRepository,
      private readonly userRepository :IUserRepository
  ) {}
  
  async signup(data: ICompanySignup): Promise<string | boolean | null> {

    try {
      const existingUser = await this.userRepository.findByEmail(data.email);
      if (existingUser) {
        return false;
      }

      const { companyName, email, password, phone } = data;
      const hashPassword = await bcrypt.hash(password, 10);


      const newUser = await this.userRepository.createUser({
        email,
        password: hashPassword,
        role: "COMPANY", 
        isVerified: false
      });
      const company = await this.companyRepository.createCompany({
        userId: newUser._id,
        companyName,
        phone,
        email
      });
     
      await this.userRepository.updateById(
        newUser._id,
        { companyId: company?._id },
      
      );

      // Generate and send OTP
      const otp = generateOTP();
      console.log("OTP" ,otp)
      
      await this.otpRepository.storeOtp(email, otp);
      await sendEmail(email, "Verify Your Email", `Your OTP is ${otp}`);
      return email;
    } catch (error) {
      console.error("Error registering the company:", error);
      return null;
    } finally {
    }
  }

    async generateOtp(email: string): Promise<any> {
      try {
          const otp = generateOTP();
          await this.otpRepository.storeOtp(email, otp);
          await sendEmail( email,"Verify Your Email", `Your OTP is ${otp}`)
          return otp;
      } catch (error) {
          console.error('Error generating OTP:', error);
          return null;
      }
  }
  
    async verifyOtp(data:IVerifyOtpDto): Promise<boolean> {
      try {
        const {email,otp} = data
          return await this.otpRepository.verifyOtp(email,otp);
      } catch (error) {
          console.error('Error verifying OTP:', error);
          return false;
      }
  }

  async verifyLogin(email: string, password: string): Promise<ICompanyUser | null> {
    try {
      console.log("login page",email,password);
      
        const user = await this.companyRepository.findByEmail(email);
      
        if (user && (await bcrypt.compare(password, user.password))) {
          return {
            _id: user._id,
            email: user.email,
             role: user.role,
            
        };
        }
        return null;
    } catch (error) {
        console.error('Error verifying login:', error);
        throw new Error('Login failed');
    }
}

async verifyRefreshToken(refreshToken: string): Promise<string | null> {
    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
        return (decoded as any).userId;
    } catch (error) {
        console.error('Error verifying refresh token:', error);
        return null;
    }
}

async generateAccessToken(userId: string): Promise<string> {
    try {
        return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '20s' });
    } catch (error) {
        console.error('Error generating access token:', error);
        throw new Error('Failed to generate access token');
    }
}


async sendResetLink(email: string) {
  try {
      if (!process.env.RESET_LINK_SECRET) {
          console.error('RESET_LINK_SECRET is not configured');
          return null;
      }

      const existingUser = await this.companyRepository.findByEmail(email);
      if (!existingUser) {
          return false;
      }
         console.log('it is an existing user');
         
      const payload = { email };
      const resetToken = jwt.sign(
          payload, 
          process.env.RESET_LINK_SECRET, 
          { expiresIn: '1h' }
      );
      console.log('reset token founds',resetToken)

      const tokenExpiry = new Date(Date.now() + 3600 * 1000);
      await this.companyRepository.storeResetToken(email, resetToken, tokenExpiry);

      const resetLink = `http://localhost:5173/resetPassword?token=${resetToken}`;
      await sendResetEmail(
          email, 
          "Password Reset", 
          `Click here to reset your password: ${resetLink}`
      );

      console.log("Reset link sent:", resetLink);
      return true;
  } catch (error) {
      console.error('Error sending reset link to the mail:', error);
      return null;
  }
}

async resetPassword (email: string, password :string) {
  try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await this.companyRepository.resetPassword(email, hashedPassword);
  } catch (error) {
      console.error('Error reseting the password:', error);
      throw new Error('Error reseting the password');
  }
}

async findOrCreateCompany(profile: any): Promise<any> {

  const email = profile.email;
  const existingUser = await this.companyRepository.findByEmail(email);
  
  if (existingUser) {
    return existingUser;
  }

  const newUser = {
    companyName:null,
    email,
    phone :null,
    googleId: profile.uid,
    password: profile.password || null,
  };


}
   
  }
  