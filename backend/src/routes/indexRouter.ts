import express from "express";
import { CompanyAuthController } from "../controllers/company/companyAuthController";
import { CompanyRepository } from "../repositories/company/companyRepository";
import { CompanyService } from "../services/company/company.service";
import  OtpRepository  from "../repositories/company/otpRepository";
import { UserRepository } from "../repositories/user/userRepository";

const router = express.Router();
const userRepository = new UserRepository();
const companyRepository = new CompanyRepository();
const otpRepository = new OtpRepository();
const companyService = new CompanyService(companyRepository,otpRepository,userRepository);
const companyController = new CompanyAuthController(companyService);



router.post("/signup", companyController.signup);
router.post("/login", companyController.login);
router.post("/verifyOtp", companyController.verifyOtp);
router.post("/resendOtp", companyController.resendOtp);
router.post('/forgotPassword',companyController.forgotPassword)
router.post('/refreshToken', companyController.refreshToken);
router.post('/resetPassword', companyController.resetPassword);


router.post('/google-login', companyController.googleLogin);
export default router;
