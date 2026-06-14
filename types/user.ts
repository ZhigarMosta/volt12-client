export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  email_verified?: boolean;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}
