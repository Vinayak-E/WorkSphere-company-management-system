import { Model } from "mongoose";
import { ICompanyDocument, ICompanyRepository ,ICompanySignup} from "../../interfaces/company/company.types";
import { Company } from "../../models/companyModel";

export class CompanyRepository implements ICompanyRepository {
  private readonly model: Model<ICompanyDocument>;

  constructor() {
    this.model = Company;
  }

  async create(company: ICompanySignup): Promise<ICompanyDocument> {
    return await this.model.create(company);
  }

  async findByEmail(email: string): Promise<ICompanyDocument | null> {
    const company = await Company.findOne({ email: email }).select('otp');
        
   
    const data =  await this.model.findOne({ email });
    if (!data) {
        throw new Error("User not found");
      }
      if (!data.password) {
        throw new Error("Password not found for user");
      }
    return data
  }

  async update(id: string, data: Partial<ICompanyDocument>): Promise<ICompanyDocument | null> {
    return await this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async updateOTP(email: string, otp: string, otpExpiry: Date): Promise<void> {
    await this.model.updateOne({ email }, { otp, otpExpiry });
  }
  async saveRefreshToken(companyId: string, refreshToken: string) {
    await this.model.updateOne(
      { _id: companyId },
      { $set: { refreshToken } } // Add a `refreshToken` field to your schema
    );
  }
  
  async verifyRefreshToken(companyId: string, refreshToken: string): Promise<boolean> {
    const company = await this.model.findOne({ _id: companyId, refreshToken });
    return !!company; // Return true if the refresh token matches
  }
  
}
