import { UserRepository } from "../../../types/repositories";
import { AppError, Result } from "../../../errors";
import { AuthProvider } from "../../../application/providers/AuthProvider";
import { User } from "../../entities";

interface LoginRequest {
  email: string;
  password: string;
}

export class LoginUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly auth: AuthProvider
  ) {}

  async execute({
    email,
    password,
  }: LoginRequest): Promise<Result<{ token: string; user: User }>> {
    try {
      const authResult = await this.auth.login(email, password);

      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        return Result.failure(new AppError("Usuário não encontrado", 404));
      }

      // Aqui você pode gerar um token JWT, por exemplo
      return Result.success({
        token: authResult.token || "",
        user: { ...user.toDTO() } as User,
      });
    } catch (error: any) {
      return Result.failure(
        new AppError(error.message || "Erro ao realizar login", 500)
      );
    }
  }
}
