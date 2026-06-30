import { createContext } from "react";

export interface AuthContextType {
  user: Record<string, unknown> | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (user: Record<string, unknown>, token: string) => void;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
