import { ClassEntity } from "../../entities/Class";
import { ClassProps } from "../../../types/entities";
import { ClassRepository } from "@/core/types/repositories";
import { Result, AppError } from "../../../errors";

export class CreateClassUseCase {
  constructor(private readonly classRepository: ClassRepository) {}

  async execute(data: ClassProps): Promise<Result<ClassEntity>> {
    const classOrError = ClassEntity.create(data);

    if (!classOrError.isSuccess || !classOrError.value) {
      return classOrError;
    }

    try {
      await this.classRepository.save(classOrError.value);
      return Result.success(classOrError.value);
    } catch (error: any) {
      return Result.failure(
        new AppError(
          error.message || "Erro ao criar turma, tente novamente mais tarde"
        )
      );
    }
  }
}
