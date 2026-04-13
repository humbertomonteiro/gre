import { Student } from "../../entities";
import { StudentRepository } from "../../../types/repositories";
import { AppError, Result } from "../../../errors";

export class GetStudentsByUserIdUseCase {
  constructor(private readonly studentRepository: StudentRepository) {}

  async execute(userId: string): Promise<Result<Student[]>> {
    try {
      const students = await this.studentRepository.findByUserId(userId);

      if (!students || students.length === 0) {
        return Result.failure(new AppError("Nenhum estudante encontrado", 404));
      }

      return Result.success(students);
    } catch (error: any) {
      return Result.failure(
        new AppError(error.message || "Erro ao buscar estudantes", 500)
      );
    }
  }
}
