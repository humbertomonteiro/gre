import { UpdateClassUseCase } from "@/core/domain/use-cases/class/UpdateClassUseCase";
import { FirebaseClassRepository } from "@/core/infra/firebase/repositories/FirebaseClassRepository";

export function makeUpdateClassUseCase() {
  const classRepository = new FirebaseClassRepository();

  return new UpdateClassUseCase(classRepository);
}
