import { AppError, Result } from "../../../errors";
import { UpdateUserProps } from "../../../types/entities";
import { UserRepository } from "../../../types/repositories";

export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}
  async execute(uid: string, updates: UpdateUserProps) {
    const user = await this.userRepository.findByUid(uid);

    if (!user) {
      return Result.failure(new AppError("Usuário não encontrado", 404));
    }

    const userUpdated = user.update(updates);
    if (!userUpdated.isSuccess || !userUpdated.value) {
      return Result.failure(userUpdated.error!);
    }

    try {
      await this.userRepository.update(uid, userUpdated.value);
      return Result.success(userUpdated.value);
    } catch (error: any) {
      return Result.failure(
        new AppError(error.message || "Erro ao atualizar usuário", 500)
      );
    }
  }
}
