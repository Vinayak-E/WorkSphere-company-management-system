import { Model } from "mongoose";
import { ICompanyDocument, ICompanyRepository ,ICompanySignup, ICreateCompany} from "../../interfaces/company/company.types";
import Company  from "../../models/companyModel";
import { UserModel } from "../../models/userModel";
import { IUser } from "../../interfaces/IUser.types";
export class CompanyRepository implements ICompanyRepository {
  private readonly model: Model<ICompanyDocument>;

  constructor() {
    this.model = Company;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const data=  await UserModel.findOne({ email });
    if (!data) {
      return null;
    }
    return data
  }

  async createCompany(newCompany:ICreateCompany) {
    try{
      const company = new this.model(newCompany)
      await company.save()
      return company
      
    }catch (error){
      console.log("Error creating the company",error);
       return null
    }
  }

  
  async storeResetToken(email: string, resetToken: string, tokenExpiry: Date): Promise<void> {
    try {
        await this.model.updateOne(
            { email },
            { resetToken, resetTokenExpiry: tokenExpiry }
        );
    } catch (error) {
        console.error('Error storing the reset toekn:', error);
    }
}

async resetPassword(email: string, password: string): Promise<void> {
    try {
        await this.model.updateOne(
            { email },
            { password }
        );
    } catch (error) {
        console.error('Error saving the new password!', error);
    }
}

  
}
