import OTP from '../../models/otpModel';
import Company from '../../models/companyModel';
import { UserModel } from '../../models/userModel';
import { IOtpRepository } from '../../interfaces/company/company.types';

class OtpRepository implements IOtpRepository {
    async storeOtp(email: string, otp: string) {
        try {
            const expiresAt = new Date(Date.now() + 5 * 60 * 1000); 
            await OTP.create({ email, otp, expiresAt });
        } catch (error) {
            console.error('Error storing OTP:', this.getErrorMessage(error));
            throw new Error(this.getErrorMessage(error));
        }
    }

    async verifyOtp(email: string, otp: string) {
        try {
            const record = await OTP.findOne({ email, otp, expiresAt: { $gt: new Date() } });
            if (record) {
                await UserModel.findOneAndUpdate({ email }, { isVerified: true });
            }
            return !!record;
        } catch (error) {
            console.error('Error verifying OTP:', this.getErrorMessage(error));
            throw new Error(this.getErrorMessage(error));
        }
    }

    private getErrorMessage(error: unknown): string {
        if (error instanceof Error) {
            return error.message;
        }
        return String(error);
    }
}

export default OtpRepository;
