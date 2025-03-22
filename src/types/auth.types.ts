// src/types/auth.types.ts
export interface User {
    email: string;
    name: string;
    picture: string;
    last_login: string;
    created_at?: string;
  }
  
  export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
  }
 