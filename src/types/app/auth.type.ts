export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstname?: string;
  lastname?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: any;
}

export const loginRequestSchema = {
  email: { required: true },
  password: { required: true },
};

export const registerRequestSchema = {
  email: { required: true },
  password: { required: true },
};

export const authResponseSchema = {
  success: { required: true },
};