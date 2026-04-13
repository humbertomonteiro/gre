import { UpdateUserUseCase } from "../../../domain/use-cases/user/UpdateUserUseCase";
import { FirebaseUserRepository } from "../../../infra/firebase/repositories/FirebaseUserRepository";

export function makeUpadateUserUseCase() {
  const userRepository = new FirebaseUserRepository();
  return new UpdateUserUseCase(userRepository);
}
