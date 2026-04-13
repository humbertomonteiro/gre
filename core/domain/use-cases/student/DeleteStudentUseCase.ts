import { Result, AppError } from "../../../errors";
import { StudentRepository } from "../../../types/entities";

export class DeleteStudentUseCase {
  constructor(private readonly studentRepository: StudentRepository) {}

  async execute(id: string): Promise<Result<void>> {
    try {
      await this.studentRepository.delete(id);
      return Result.success(undefined);
    } catch (error: unknown) {
      const msg =
        error instanceof Error ? error.message : "Erro ao deletar estudante";
      return Result.failure(new AppError(msg, 500));
    }
  }
}
