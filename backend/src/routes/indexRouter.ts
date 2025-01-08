import express from "express";
import { CompanyAuthController } from "../controllers/company/companyAuthController";
import { CompanyRepository } from "../repositories/company/companyRepository";
import { CompanyService } from "../services/company/companyService";
import  OtpRepository  from "../repositories/company/otpRepository";
const router = express.Router();

const companyRepository = new CompanyRepository();
const otpRepository = new OtpRepository();
const companyService = new CompanyService(companyRepository,otpRepository);
const companyController = new CompanyAuthController(companyService);

router.post("/signup", companyController.signup);
router.post("/login", companyController.login);
router.post("/verifyOtp", companyController.verifyOtp);
router.post("/resendOtp", companyController.resendOtp);

export default router;
