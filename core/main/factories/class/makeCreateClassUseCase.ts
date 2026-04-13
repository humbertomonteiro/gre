import { CreateClassUseCase } from "../../../domain/use-cases/class/CreateClassUseCase";
import { FirebaseClassRepository } from "../../../infra/firebase/repositories/FirebaseClassRepository";

export function makeCreateClassUseCase() {
  const classRepository = new FirebaseClassRepository();

  return new CreateClassUseCase(classRepository);
}
