import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IAddress, ICompanyDocument } from '../interfaces/company/company.types';

const addressSchema = new Schema<IAddress>(
  {
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    zipCode: { type: String, required: true, match: [/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'] },
  },
  { _id: false }
);

const companySchema = new Schema<ICompanyDocument>(
  {
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      minlength: [2, 'Company name must be at least 2 characters long'],
      maxlength: [100, 'Company name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^\+?[\d\s-]{10,}$/, 'Please enter a valid phone number'],
    },
    role:{
      type : String,
    },
    address: {
      type: addressSchema,
      required: false,
    },
    isEmailVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    otp: { type: String },
    otpExpiry: { type: Date, select: false },
    logo: {
      type: String,
      default :false,
      required: false,
 
    },
    industry: {
      type: String,
      required:false,
      enum: [
        'Technology',
        'Healthcare',
        'Finance',
        'Manufacturing',
        'Retail',
        'Education',
        'Other',
      ],
    },
    description: {
      required:false,
      type: String,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    subscriptionPlan: {
      type: String,
      enum: ['free', 'basic', 'premium', 'enterprise'],
      default: 'free',
    },
    subscriptionStatus: {
      type: String,
      enum: ['active', 'inactive', 'expired'],
      default: 'inactive', // Default to 'inactive' to align with email verification
    },
    subscriptionExpiry: { type: Date },
    lastLogin: { type: Date },
    refreshToken: { type: String, select: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        delete ret.password;
        delete ret.otp;
        delete ret.otpExpiry;
        delete ret.refreshToken;
        delete ret.passwordResetToken;
        delete ret.passwordResetExpires;
        return ret;
      },
    },
  }
);

companySchema.index({ email: 1 }, { unique: true });
companySchema.index({ companyName: 'text', description: 'text' });


// Compare passwords
companySchema.methods.comparePassword = async function (candidatePassword: string) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if the subscription is valid
companySchema.methods.hasValidSubscription = function () {
  return (
    this.subscriptionStatus === 'active' &&
    (!this.subscriptionExpiry || new Date() < this.subscriptionExpiry)
  );
};

const Company = mongoose.model<ICompanyDocument>('Company', companySchema);
export default Company;