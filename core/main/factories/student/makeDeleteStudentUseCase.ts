import { FirebaseStudentRepository } from "../../../infra/firebase/repositories/FirebaseStudentRepository";
import { DeleteStudentUseCase } from "../../../domain/use-cases/student/DeleteStudentUseCase";

export function makeDeleteStudentUseCase() {
  return new DeleteStudentUseCase(new FirebaseStudentRepository());
}
