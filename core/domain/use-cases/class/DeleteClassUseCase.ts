import { Result, AppError } from "../../../errors";
import { FirebaseClassRepository } from "../../../infra/firebase/repositories/FirebaseClassRepository";

export class DeleteClassUseCase {
  constructor(private readonly classRepository: FirebaseClassRepository) {}

  async execute(id: string): Promise<Result<void>> {
    try {
      await this.classRepository.delete(id);
      return Result.success(undefined);
    } catch (error: unknown) {
      const msg =
        error instanceof Error ? error.message : "Erro ao deletar turma";
      return Result.failure(new AppError(msg, 500));
    }
  }
}
