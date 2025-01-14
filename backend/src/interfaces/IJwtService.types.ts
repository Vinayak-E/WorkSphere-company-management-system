export interface IPayload {
    userId: string;
    email: string;
    role: string;
    iat?: number;
    exp?: number;
  }
  
  export interface IJwtService {
    generateRefreshToken(data:IPayload): Promise<string>;
    generateAccessToken(data:IPayload): Promise<string>;
    verifyJwtToken(token: string): Promise<IPayload>;
  }
  