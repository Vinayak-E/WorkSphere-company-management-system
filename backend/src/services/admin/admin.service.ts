import { IJwtService } from "../../interfaces/IJwtService.types";
import { IAdminRepository, IAdminService } from "../../interfaces/admin/admin.types";

import bcrypt from 'bcryptjs'
import { ICompanyRepository } from "../../interfaces/company/company.types";
export class AdminService implements IAdminService {
  constructor(
    private jwtService: IJwtService,
    private adminRepository: IAdminRepository,
    private companyRepository: ICompanyRepository
  ) {}

  async verifyAdmin(email: string, password: string): Promise<{
    refreshToken: string;
    accessToken: string;
  } | null> {
    try {
        console.log('email at service',email)
      const admin = await this.adminRepository.findByEmail(email);
      
      if (!admin || admin.role !== "ADMIN") {
        return null;
      }

      const isValidPassword = await bcrypt.compare(password, admin.password);
      
      if (!isValidPassword) {
        return null;
      }

      const data = {
        userId: admin._id,
        email: admin.email,
        role: admin.role,
      };

      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.generateAccessToken(data),
        this.jwtService.generateRefreshToken(data)
      ]);

      return { accessToken, refreshToken };
    } catch (error) {
      console.error('Error verifying login:', error);
      throw new Error('Login failed');
    }
  }

  async getCompanies(
    filter: { status?: string } = {},
    options: { page?: number; limit?: number } = {}
  ): Promise<any> {
    try {
      const { page = 1, limit = 10 } = options; 
  
      const companies = await this.adminRepository.findCompanies(filter, {
        skip: (page - 1) * limit,
        limit,
      });
      console.log('request found at service')
      console.log('companies found at service',companies)
  
      const totalCompanies = await this.adminRepository.countCompanies(filter);
  
      return {
        companies,
        totalCompanies,
        currentPage: page,
        totalPages: Math.ceil(totalCompanies / limit),
      };
    } catch (error) {
      console.error("Error fetching companies:", error);
      throw new Error("Failed to fetch companies");
    }
  }
  

}
