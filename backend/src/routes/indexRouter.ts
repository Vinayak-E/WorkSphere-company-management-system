import express from "express";
import { CompanyAuthController } from "../controllers/company/companyAuthController";
import { CompanyRepository } from "../repositories/company/companyRepository";
import { CompanyService } from "../services/company/companyService";

const router = express.Router();

const companyRepository = new CompanyRepository();
const companyService = new CompanyService(companyRepository);
const companyController = new CompanyAuthController(companyService);

router.post("/signup", companyController.signup);
router.post("/login", companyController.login);
router.post("/verifyOtp", companyController.verifyOTP);
router.post("/resendOtp", companyController.resendOTP);

export default router;
