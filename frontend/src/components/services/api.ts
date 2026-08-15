import type {
  RegisterPayload,
  LoginPayload,
  AuthResponse,
  PrivateDataResponse,
} from "../types/auth";

const BASE_URL = "https://jwt-1-wosa.onrender.com/api/v1/auth";

export const registerUser = async (data: RegisterPayload): Promise<AuthResponse> => {
  const response = await fetch(`${BASE_URL}/registration`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const loginUser = async (data: LoginPayload): Promise<AuthResponse> => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const getPrivateData = async (
  token: string
): Promise<PrivateDataResponse | { message: string }> => {
  const response = await fetch(`${BASE_URL}/privateData`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};