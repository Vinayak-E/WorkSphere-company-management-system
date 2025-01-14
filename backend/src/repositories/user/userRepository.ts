import { Model } from "mongoose";
import { IUserRepository,IUser } from "../../interfaces/IUser.types";
import { UserModel } from "../../models/userModel";

export class UserRepository implements IUserRepository{
    private readonly model: Model<IUser>; 
    constructor(){
        this.model = UserModel
    }

     async createUser(userData : Partial<IUser>) {
        const user = new this.model(userData)
        const data = await user.save()
        return data

     }


      async findByEmail(email: string): Promise<IUser | null> {
        const data=  await this.model.findOne({ email });
        if (!data) {
          return null;
        }
        return data
      }

      async findByCompanyId(companyId: string) {
        return await this.model.find({ companyId });
      }
    
      async updateById(userId: string, update: Partial<IUser>, options?: any) {
        return await this.model.findByIdAndUpdate(userId, update, { 
          new: true,
          ...options 
        });
      }
    
}