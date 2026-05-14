export interface User {
  id: number;
  email: string;
  username: string;
  phone_number: string | null;
  role: string;
  avatar: string | null;
  loyalty_points: number;
}

export interface AuthResponse {
  user: User;
  access: string;
  refresh: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  phone_number?: string;
  password: string;
  password2: string;
}