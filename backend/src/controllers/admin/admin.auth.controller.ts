import { Request,Response } from "express";
import { IAdminService } from "../../interfaces/admin/admin.types";
import { NextFunction, RequestHandler } from "express-serve-static-core";


export class AdminAuthController {
    constructor(private readonly adminService : IAdminService) {}
    
    adminLogin: RequestHandler = async (req, res, next) => {
        try {
            const { inputEmail: email, inputPassword: password } = req.body;
         console.log('Request received',req.body);
         
  
          if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
            throw new Error("JWT secrets are not configured");
          }
    
     
          const response = await this.adminService.verifyAdmin(email, password);
            console.log('response forn the service',response);
            
          if (!response) {
            res.status(400).json({ message: "Invalid email or password!" });
            return;
          }
    
          if (response.refreshToken) {
            res.cookie("refreshToken", response.refreshToken, {
              httpOnly: true,
              sameSite: "lax",
              maxAge: 7 * 24 * 60 * 60 * 1000, 
            });
          }
    
          if (response.accessToken) {
            res.cookie("accessToken", response.accessToken, {
              httpOnly: true,
              sameSite: "lax",
              secure: process.env.NODE_ENV === "production",
              maxAge: 15 * 60 * 1000,
            });
          }
    
          res.status(200).json({
            success: true,
            accessToken: response.accessToken,
          });
        } catch (error) {
          console.error("Error Logging:", error);
          res.status(500).json({ message: "Error Logging user", error });
        }
      };

      companiesList: RequestHandler = async (req, res, next) => {
        try {
          console.log('Request received at controller');
      
          const companies = await this.adminService.getCompanies();
      
          console.log("Companies at controller", companies);
      
          res.status(200).json(companies.companies);

        } catch (error) {
          console.error("Error fetching companies:", error);
          res.status(500).json({ error: "Error fetching companies" });
        }
      };
      

}


