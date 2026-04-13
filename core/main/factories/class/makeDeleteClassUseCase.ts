import { FirebaseClassRepository } from "../../../infra/firebase/repositories/FirebaseClassRepository";
import { DeleteClassUseCase } from "../../../domain/use-cases/class/DeleteClassUseCase";

export function makeDeleteClassUseCase() {
  return new DeleteClassUseCase(new FirebaseClassRepository());
}
