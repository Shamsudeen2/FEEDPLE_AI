import { createContext } from "react";
import type { MockUser } from "../services/mockApi";

export interface AuthContextType {
  user: Omit<MockUser, "password"> | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (user: Omit<MockUser, "password">, token: string) => void;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
