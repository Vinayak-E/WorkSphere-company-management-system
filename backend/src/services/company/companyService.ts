  import {ICompanySignup,IVerifyOtpDto,ICompanyService,ICompanyRepository, IOtpRepository ,ICompanyUser} from "../../interfaces/company/company.types";
  import { sendEmail } from "../../utils/email"; 
  import {generateOTP} from "../../utils/otp"
  import bcrypt from "bcryptjs"
  import jwt from "jsonwebtoken";
  


  export class CompanyService implements ICompanyService {

    constructor(
      private readonly companyRepository: ICompanyRepository,
      private readonly otpRepository: IOtpRepository
  ) {}
  
    async signup(data: ICompanySignup):Promise<string | boolean | null>{
      try{
        const existingCompany = await this.companyRepository.findByEmail(data.email);

        if (existingCompany) {
         return false
        }
        const {companyName,email,password,phone} = data
        const hashPassword = await bcrypt.hash(password,10)
        const newCompany = {
            companyName,
          email,
          phone,
          googleId: null,
          password: hashPassword,
        };
  
      const registeredMail = await this.companyRepository.createCompany(newCompany);
     
        const otp = generateOTP(); 
       await this.otpRepository.storeOtp(email,otp)
       await sendEmail( email,"Verify Your Email", `Your OTP is ${otp}`)
       console.log("OTP",otp);

       return registeredMail

      }catch(error){
        console.log("Error registering the company",error);
        return null
        
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
// async sendResetLink (email: string) {
//   try {
//       const existingUser = await this.companyRepository.findByEmail(email);
//       if (!existingUser) {
//           return false;
//       }

//       const payload = { email };
//       const resetToken = jwt.sign(payload, process.env.RESET_LINK_SECRET, { expiresIn: '1h' });
//       const tokenExpiry = new Date(Date.now() + 3600 * 1000);
//       await this.companyRepository.storeResetToken(email, resetToken, tokenExpiry);

//       const resetLink = `http://localhost:5173/users/resetPassword?token=${resetToken}`;
//       await sendResetEmail(email, "Password Reset", `Click here to reset your password: ${resetLink}`);

//       console.log("Reset link sent:", resetLink);
//       return true;
//   } catch (error) {
//       console.error('Error sending reset link to the mail:', error);
//       return null;
//   }
// }
  
   
  }
  