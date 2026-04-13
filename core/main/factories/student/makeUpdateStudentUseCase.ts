import { UpdateStudentUseCase } from "../../../domain/use-cases/student/UpdateStudentUseCase";
import { FirebaseStudentRepository } from "../../../infra/firebase/repositories/FirebaseStudentRepository";

export function makeUpdateStudentUseCase() {
  const studentRepository = new FirebaseStudentRepository();

  return new UpdateStudentUseCase(studentRepository);
}
