import { AppError, Result } from "../../../errors";
import { UpdateStudentDTO } from "../../../types/entities";
import { StudentRepository } from "../../../types/repositories";
import { Student } from "../../entities";

export class UpdateStudentUseCase {
  constructor(private readonly studentRepository: StudentRepository) {}

  async execute(id: string, data: UpdateStudentDTO): Promise<Result<Student>> {
    try {
      const student = await this.studentRepository.findById(id);
      if (!student) {
        return Result.failure(new AppError("Estudante não encontrado", 404));
      }

      const updatedStudent = student.update(data);
      if (!updatedStudent.isSuccess || !updatedStudent.value) {
        return Result.failure(
          updatedStudent.error ??
            new AppError("Erro ao atualizar estudante", 400)
        );
      }

      await this.studentRepository.update(id, updatedStudent.value.toDTO());
      return Result.success(updatedStudent.value);
    } catch (error: any) {
      return Result.failure(
        new AppError(error.message || "Erro ao atualizar estudante", 500)
      );
    }
  }
}
