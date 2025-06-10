export interface LoginRequest {
  email: string;
  username: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  success: Boolean;
  message: string;
  date?: {
    token: string;
    user: {
      id: number;
      email: string;
      username: string;
      created_at: Date;
    };
  };
}

export interface AuthUser {
  id: number;
  email: string;
  user: string;
}
