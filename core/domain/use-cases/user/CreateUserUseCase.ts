import { PasswordHasher } from "../../../application/cryptography/PasswordHasher";
import { User } from "../../entities";
import { UserRepository } from "../../../types/repositories";
import { Result, AppError } from "../../../errors";
import { AuthProvider } from "../../../../core/application/providers/AuthProvider";

interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private auth: AuthProvider
  ) {}

  async execute(data: CreateUserRequest): Promise<Result<User>> {
    try {
      const hashedPassword = await this.passwordHasher.hash(data.password);

      const authResult = await this.auth.register(data.email, data.password);

      const userOrError = User.create({
        id: authResult.userId,
        name: data.name,
        email: data.email,
        passwordHash: hashedPassword,
      });

      if (!userOrError.isSuccess || !userOrError.value) {
        await this.auth.logout();
        return userOrError;
      }

      await this.userRepository.save(userOrError.value);
      return Result.success(userOrError.value);
    } catch (error: any) {
      return Result.failure(
        new AppError(error.message || "Erro ao criar usuário", 500)
      );
    }
  }
}
