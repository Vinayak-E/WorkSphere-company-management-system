import jwt from "jsonwebtoken";
import { envConfig } from "../configs/envConfig";
import { IJwtService, IPayload } from "../interfaces/IJwtService.types";

export class JwtService implements IJwtService {
  public async generateRefreshToken(data: IPayload): Promise<string> {
    const secretKey = envConfig.JWT_SECRETKEY || "";
    const payload = {
      userId: data.userId,
      email: data.email,
      role: data.role,
    };

    const token = jwt.sign(payload, secretKey, { expiresIn: "3d" });
    return token;
  }

  public async verifyJwtToken(token: string): Promise<IPayload> {
    const secretKey = envConfig.JWT_SECRETKEY || "";
    const decoded = jwt.verify(token, secretKey) as IPayload;
    return decoded;
  }

  public async generateAccessToken(data: IPayload): Promise<string> {
    const payload = {
      userId: data.userId,
      email: data.email,
      role: data.role,
    };
    return jwt.sign(payload, envConfig.JWT_SECRETKEY || "", {
      expiresIn: "15m",
    });
  }
}