import { FlattenMaps, ObjectId } from "mongoose";
import { Document } from "mongoose";

export interface IUser extends Document {
  _id : string
  name: string;
  email: string;
  password: string;
  companyId?:string;
  phone: string;
  isVerified:boolean,
  department: string;
  designation: string;
  role:string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}


export interface IUserRepository{

findByEmail(email: string): Promise<IUser | null>;
createUser(user: Partial<IUser>, options?: any): Promise<IUser>;
updateById(userId: string, update: Partial<IUser>, options?: any): Promise<(FlattenMaps<IUser> & Required<{
  _id: string;
}> & {
  __v: number;
}) | null>
}