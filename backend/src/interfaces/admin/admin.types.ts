import { IUser } from "../IUser.types";

export interface IAdminLoginData {
    email :string,
    password :string
}


export interface IAdminService {
    verifyAdmin(email:string,password:string): Promise<{accessToken: string, refreshToken: string} | null>;
    getCompanies(filter?: {
    status?: string;
    }, options?: {
    page?: number;
    limit?: number;
    }): Promise<any>
  
  }
  


  export interface IAdminRepository {
    findByEmail(email: string): Promise<IUser | null>;
    findCompanies(filter: any, options: {
      skip: number;
      limit: number;
  }): Promise<any>;
  countCompanies(filter: any): Promise<number>
  }
