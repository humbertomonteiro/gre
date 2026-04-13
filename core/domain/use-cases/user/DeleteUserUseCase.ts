import { AppError, Result } from "../../../errors";
import { UserRepository } from "../../../types/repositories";

export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}
  async execute(uid: string) {
    const user = await this.userRepository.findByUid(uid);

    if (!user) {
      return Result.failure(new AppError("Usuário não encontrado", 404));
    }

    try {
      await this.userRepository.delete(uid);
      return Result.success("Deleted successfully");
    } catch (error) {
      return Result.failure(new AppError(`Erro ao tentar deletar: ${error}`));
    }
  }
}
