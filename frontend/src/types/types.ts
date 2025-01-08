export interface FormData {
    companyName: string;
    email: string;
    password: string;
    phone: string;
    confirmPassword: string;
  }
  
  export interface ValidationErrors {
    [key: string]: string;
  }
  
  export interface ApiResponse {
    success: boolean;
    message: string;
    data?: {
      token: string;
      user: {
        id: string;
        email: string;
        companyName: string;
      };
    };
  }