import {ICompanySignup,IVerifyOtpDto,ICompanyService,ICompanyRepository,} from "../../interfaces/company/company.types";
  import { sendEmail } from "../../utils/email"; 
  import crypto from "crypto";
  import bcrypt from "bcryptjs"
  import jwt from "jsonwebtoken";
  
  export class CompanyService implements ICompanyService {
    constructor(private readonly companyRepository: ICompanyRepository) {}
  
    async signup(data: ICompanySignup): Promise<void> {
      const existingCompany = await this.companyRepository.findByEmail(data.email);
      if (existingCompany) {
        throw new Error("Email already registered");
      }
  
      const otp = crypto.randomInt(100000, 999999).toString(); 
      const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); 
  
      const companyData = { ...data, otp, otpExpiry, isEmailVerified: false };
      await this.companyRepository.create(companyData as any);
  
      await sendEmail(data.email, "Verify Your Email", `Your OTP is ${otp}`);
    }
  
    async verifyOTP(data: IVerifyOtpDto): Promise<void> {
      const company = await this.companyRepository.findByEmail(data.email);
      if (!company) {
        throw new Error("Company not found");
      }
  
      if (company.otp !== data.otp || new Date() > company.otpExpiry!) {
        throw new Error("Invalid or expired OTP");
      }
  
      await this.companyRepository.update(company._id, {
        isEmailVerified: true,
        otp: undefined,
        otpExpiry: undefined,
      });
    }
  
    async resendOTP(email: string): Promise<void> {
      const company = await this.companyRepository.findByEmail(email);
      if (!company) {
        throw new Error("Company not found");
      }
  
      const otp = crypto.randomInt(100000, 999999).toString();
      const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);
  
      await this.companyRepository.updateOTP(email, otp, otpExpiry);
      await sendEmail(email, "Resend OTP", `Your new OTP is ${otp}`);
    }

    async login(email: string, password: string) {
        const company = await this.companyRepository.findByEmail(email);
        if (!company) {
          throw new Error("Invalid credentials");
        }
      
        const isPasswordValid = await bcrypt.compare(password, company.password);
        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }
      
        const jwtSecret = process.env.JWT_SECRET;
        const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
        
        if (!jwtSecret || !refreshTokenSecret) {
          throw new Error("Missing JWT_SECRET or REFRESH_TOKEN_SECRET environment variable");
        }
        
        // Generate Access Token
        const accessToken = jwt.sign(
          { companyId: company._id },
          jwtSecret,
          { expiresIn: "15m" }
        );
        
        // Generate Refresh Token
        const refreshToken = jwt.sign(
          { companyId: company._id },
          refreshTokenSecret,
          { expiresIn: "7d" }
        );
      
        // Save the refresh token (e.g., in a database or Redis)
        await this.companyRepository.saveRefreshToken(company._id, refreshToken);
      
        return {
          accessToken,
          refreshToken,
          company: {
            id: company._id,
            email: company.email,
            name: company.companyName,
          },
        };
      }

      async refreshToken(refreshToken: string) {
        const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
        if (!refreshTokenSecret) {
          throw new Error("Missing REFRESH_TOKEN_SECRET environment variable");
        }
      
        try {
          // Verify the refresh token
          const decoded = jwt.verify(refreshToken, refreshTokenSecret) as jwt.JwtPayload & { companyId: string };
          if (!decoded.companyId) {
            throw new Error("Invalid token payload");
          }
      
          // Ensure the refresh token exists in the database
          const isTokenValid = await this.companyRepository.verifyRefreshToken(decoded.companyId, refreshToken);
          if (!isTokenValid) {
            throw new Error("Invalid refresh token");
          }
      
          // Generate a new access token
          const accessToken = jwt.sign(
            { companyId: decoded.companyId },
            process.env.JWT_SECRET!,
            { expiresIn: "15m" }
          );
      
          return { accessToken };
        } catch (error) {
          throw new Error("Invalid or expired refresh token");
        }
      }
      
      
      
    
    
  }
  