import { AppError, Result } from "../../../errors";
import { UpdateClassProps } from "../../../types/entities";
import { ClassRepository } from "../../../types/repositories";
import { ClassEntity } from "../../entities";

export class UpdateClassUseCase {
  constructor(private readonly classRepository: ClassRepository) {}

  async execute(
    id: string,
    data: UpdateClassProps
  ): Promise<Result<ClassEntity>> {
    try {
      const student = await this.classRepository.findById(id);
      if (!student) {
        return Result.failure(new AppError("Turma não encontrada", 404));
      }

      const updatedClass = student.update(data);
      if (!updatedClass.isSuccess || !updatedClass.value) {
        return Result.failure(
          updatedClass.error ?? new AppError("Erro ao atualizar estudante", 400)
        );
      }

      await this.classRepository.update(id, updatedClass.value.toDTO());
      return Result.success(updatedClass.value);
    } catch (error: any) {
      return Result.failure(
        new AppError(error.message || "Erro ao atualizar turma", 500)
      );
    }
  }
}
