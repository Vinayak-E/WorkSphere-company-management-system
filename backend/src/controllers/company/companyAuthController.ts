import { Request, Response, NextFunction, RequestHandler } from "express";
import { ICompanyService } from "../../interfaces/company/company.types";
import jwt, { JwtPayload} from "jsonwebtoken";

export class CompanyAuthController {
  constructor(private readonly companyService: ICompanyService) {}

  signup: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const registeredMail =  await this.companyService.signup(data);
      console.log('registered mail: ', registeredMail);
      if (registeredMail) {
        res.status(201).json({ success: true, registeredMail });
    } else {
        res.status(400).json({ success: false, message: 'This email is already registered!' });
    }
} catch (error) {
    console.error('Error registering the user:', error);
    res.status(500).json({ message: 'Error registering user', error });
}
  };

 verifyOtp :RequestHandler = async (req: Request, res: Response, next: NextFunction) =>{
    try {
        const verified = await this.companyService.verifyOtp(req.body);
        if (!verified) {
            res.status(400).json({ message: 'Wrong OTP!' });
            return;
        }
        console.log("otp verification",verified);
        
        res.status(200).json({ message: 'OTP verification successful!' });
    } catch (error) {
        console.error('Error verifying the OTP:', error);
        res.status(500).json({ message: 'Error verifying the OTP', error });
    }
}


resendOtp:RequestHandler = async (req: Request, res: Response, next: NextFunction) =>{
  try {
      const { email } = req.body;
      
      const otp = await this.companyService.generateOtp(email);
      if (otp) {
          console.log('New otp: ', otp);
          res.status(200).json({ success: true, message: 'Otp generated successfully!' });
      }
  } catch (error) {
      console.log('Error generating the OTP:', error);
      res.status(500).json({ message: 'Error generating the OTP', error });
  }
}
login:RequestHandler = async (req: Request, res: Response, next: NextFunction) =>{
  try {
      const { email, password } = req.body;


      if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
          throw new Error('JWT secrets are not configured');
        }

        const user = await this.companyService.verifyLogin(email, password);
      if (!user) {
          res.status(400).json({ message: 'Invalid email or password!' });
          return;
      }
      
        const accessToken = jwt.sign(
            { userId: user._id }, 
            process.env.ACCESS_TOKEN_SECRET, 
            { expiresIn: '20s' }
        );

        const refreshToken = jwt.sign(
            { userId: user._id }, 
            process.env.REFRESH_TOKEN_SECRET, 
            { expiresIn: '1h' }
        );
      res.status(200).json({
          message: 'Login successful!',
          responseData: {
              email: user.email,
              accessToken,
              refreshToken,
               role:user.role
          },
      });
  } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ message: 'Error logging in', error });
  }
}

refreshToken:RequestHandler = async (req: Request, res: Response, next: NextFunction) =>{
  try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
          res.status(401).json({ message: 'Refresh token not found' });
          return;
      }

      const userId = await this.companyService.verifyRefreshToken(refreshToken);
      if (!userId) {
          res.status(403).json({ message: 'Invalid refresh token' });
          return;
      }

      const newAccessToken = await this.companyService.generateAccessToken(userId);
      res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
      console.error('Error refreshing token:', error);
      res.status(500).json({ message: 'Error refreshing token', error });
  }
}


//  forgotPassword :RequestHandler = async (req: Request, res: Response, next: NextFunction) =>{
//   try {
//       const { email } = req.body;
//       const sendResetLink = await this.companyService.sendResetLink(email);
//       if (sendResetLink === false) {
//           res.status(400).json({ message: 'The email is not registered!' });
//       } else if (sendResetLink) {
//           res.status(200).json({ message: 'The otp has sent to your email' });
//       }
//   } catch (error) {
//       res.status(500).json({ message: 'Something went wrong!', error: error.message });
//       console.log('Something went wrong during resetting the forgot password', error);
//   }
// }

//  resetPassword :RequestHandler = async (req: Request, res: Response, next: NextFunction) =>{
//   const { token, newPassword } = req.body;
//   console.log('token & pass: ', token, ' ', newPassword);
//   try {
//       interface TokenPayload extends JwtPayload {
//           email: string;
//       }

//       const decoded = jwt.verify(token, process.env.RESET_LINK_SECRET as string) as TokenPayload;
//       console.log('decoded: ', decoded);
//       const { email } = decoded;
//       await this.companyService.resetPassword(email, newPassword);
//       res.status(200).json({ message: 'Token is valid', decoded });
//   } catch (error) {
//       res.status(400).json({ message: 'Invalid or expired token' });
//   }
// };
}