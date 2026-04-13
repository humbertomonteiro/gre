"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";
import { User } from "@/core/domain/entities";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

export const UserContext = createContext<AuthContextType | undefined>(
  undefined
);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar dados do localStorage ao inicializar
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      // Restaura o cookie caso tenha expirado mas o localStorage ainda tenha sessão
      document.cookie = `auth-token=${storedToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    }

    setIsLoading(false);
  }, []);

  const login = (userData: User, userToken: string) => {
    setUser(userData);
    setToken(userToken);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userToken);

    // Cookie para o middleware de proteção de rotas (7 dias)
    document.cookie = `auth-token=${userToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Remove o cookie de auth
    document.cookie = "auth-token=; path=/; max-age=0";
  };

  const value = {
    user,
    token,
    login,
    logout,
    isLoading,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useUser = () => {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
};
