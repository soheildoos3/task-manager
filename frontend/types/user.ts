export interface User {
  id: number;
  email: string;
  full_name: string | null;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
}

export interface UserCreate {
  email: string;
  full_name?: string;
  password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserUpdate {
  full_name?: string;
  email?: string;
}

export interface UserChangePassword {
  old_password: string;
  new_password: string;
}