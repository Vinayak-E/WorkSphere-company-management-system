import { IUser } from "../../interfaces/IUser.types"; 
import { Model } from "mongoose";
import { UserModel } from "../../models/userModel";
import { IAdminRepository } from "../../interfaces/admin/admin.types";
import Company from "../../models/companyModel";

interface CompanyFilter {
  status?: string;
}
export class AdminRepository implements IAdminRepository {
  private readonly model: Model<IUser>; 
  constructor() {
    this.model = UserModel;
  }

  async findByEmail(email: string): Promise<IUser | null> {
      console.log('email',email)
    const data = await this.model.findOne({ email });
    console.log("data received at repository",data)
    if (!data) {
      return null;
    }
    return data;
  }

  async findCompanies(filter: CompanyFilter, options: { skip: number; limit: number }): Promise<any> {
    const query: any = {};
  
    if (filter.status) {
      query.status = filter.status;
    }
  
    return await Company.find(query)
      .skip(options.skip)
      .limit(options.limit)
      .lean();
  }
  
  async countCompanies(filter: CompanyFilter): Promise<number> {
    const query: any = {};
  
    if (filter.status) {
      query.status = filter.status;
    }
  
    return await Company.countDocuments(query);
  }
}
