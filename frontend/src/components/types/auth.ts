export interface RegisterPayload {
  userName: string;
  email: string;
  password: string;
  role?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
}

export interface PrivateDataResponse {
  success: boolean;
  message: string;
}