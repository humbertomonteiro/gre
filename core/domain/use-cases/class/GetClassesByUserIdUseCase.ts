import { ClassEntity } from "../../entities";
import { ClassRepository } from "@/core/types/repositories";
import { AppError, Result } from "../../../errors";

export class GetsClassesByUserIdUseCase {
  constructor(private readonly classRepository: ClassRepository) {}

  async execute(userId: string): Promise<Result<ClassEntity[]>> {
    try {
      const classes = await this.classRepository.findByUserId(userId);

      if (!classes || classes.length === 0) {
        return Result.failure(new AppError("Nenhuma turma encontrado", 404));
      }

      return Result.success(classes);
    } catch (error: any) {
      return Result.failure(
        new AppError(error.message || "Erro ao buscar turmas", 500)
      );
    }
  }
}
