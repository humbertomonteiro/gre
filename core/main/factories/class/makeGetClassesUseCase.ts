import { FirebaseClassRepository } from "../../../infra/firebase/repositories/FirebaseClassRepository";
import { GetsClassesByUserIdUseCase } from "../../../domain/use-cases/class/GetClassesByUserIdUseCase";

export function makeGetClassesByUserIdUseCase() {
  const classRespository = new FirebaseClassRepository();
  return new GetsClassesByUserIdUseCase(classRespository);
}
