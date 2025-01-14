import { Document, Schema, model } from "mongoose";
import { IUser } from "../interfaces/IUser.types";

const UserSchema = new Schema<IUser>(
  {
    name: { type: String,},
    email: { type: String, },
    password: { type: String,},
    phone: { type: String },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
    isVerified:{type:Boolean ,default: false},
    department: { type: String, },
    designation: { type: String, },
    role: { type: String, required: true, enum: ["ADMIN", "MANAGER", "EMPLOYEE","COMPANY"] },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);


export const UserModel = model<IUser>("User", UserSchema); 
