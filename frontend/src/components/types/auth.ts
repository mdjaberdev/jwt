export interface RegisterPayload {
  email: string;
  role: string;
}

export interface LoginPayload {
  email: string;
}

export interface LoginResponse {
  success: boolean;
  message: {
    accessToken: string;
  };
}

export interface PrivateDataResponse {
  success: boolean;
  message: string;
}

export interface ApiErrorResponse {
  message?: string;
}