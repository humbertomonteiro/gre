import { CreateStudentUseCase } from "../../../domain/use-cases/student/CreateStudentUseCase";
import { FirebaseStudentRepository } from "../../../infra/firebase/repositories/FirebaseStudentRepository";

export function makeCreateStudentUseCase() {
  const studentRepository = new FirebaseStudentRepository();

  return new CreateStudentUseCase(studentRepository);
}
