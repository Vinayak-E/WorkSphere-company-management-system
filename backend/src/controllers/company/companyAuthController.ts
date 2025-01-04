import { Request, Response, NextFunction, RequestHandler } from "express";
import { ICompanyService } from "../../interfaces/company/company.types";

export class CompanyAuthController {
  constructor(private readonly companyService: ICompanyService) {}

  signup: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      await this.companyService.signup(data);
      res.status(201).json({ message: "Signup successful!" });
    } catch (error) {
      next(error);
    }
  };

  login:RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw new Error("Email and password are required");
      }
      const result = await this.companyService.login(email, password);
      res.status(200).json({
        message: "Login successful",
        result: result,
      });
    } catch (error) {
      next(error);
    }
  };

  verifyOTP:RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      await this.companyService.verifyOTP(data);
      res.status(200).json({ message: "OTP verified successfully!" });
    } catch (error) {
      next(error);
    }
  };

  resendOTP:RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      await this.companyService.resendOTP(email);
      res.status(200).json({ message: "OTP resent successfully!" });
    } catch (error) {
      next(error);
    }
  };
}
