export interface AuthProvider {
  register(email: string, password: string): Promise<{ userId: string }>;
  login(
    email: string,
    password: string
  ): Promise<{ userId: string; token?: string }>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<{ userId: string; email: string } | null>;
}
