import { FirebaseStudentRepository } from "../../../infra/firebase/repositories/FirebaseStudentRepository";
import { GetStudentsByUserIdUseCase } from "../../../domain/use-cases/student/GetStudentsByUserIdUseCase";

export function makeGetTudentByUserIdUseCase() {
  const studentRepository = new FirebaseStudentRepository();
  return new GetStudentsByUserIdUseCase(studentRepository);
}
