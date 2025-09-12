export interface LoginResponse {
  message: string;
  results: {
    isVerified: boolean;
    role: string;
    username: string;
    token: string;
    id?: string;
  };
}

export interface ApiError {
  message: string;
  data: null;
}

export interface LoginCredentials {
  identifier: string;
  password: string;
}
