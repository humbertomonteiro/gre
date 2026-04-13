import { Student } from "../../entities";
import { StudentRepository, StudentProps } from "../../../types/entities";
import { Result, AppError } from "../../../errors";

export class CreateStudentUseCase {
  constructor(private readonly studentRepository: StudentRepository) {}

  async execute(data: StudentProps): Promise<Result<Student>> {
    const studentOrError = Student.create(data);

    if (!studentOrError.isSuccess || !studentOrError.value) {
      return studentOrError;
    }

    try {
      await this.studentRepository.save(studentOrError.value);
      return Result.success(studentOrError.value);
    } catch (error: any) {
      return Result.failure(
        new AppError(error.message || "Erro ao salvar estudante")
      );
    }
  }
}
