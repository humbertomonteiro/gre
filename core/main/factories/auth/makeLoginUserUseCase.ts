import { FirebaseUserRepository } from "../../../infra/firebase/repositories/FirebaseUserRepository";
import { LoginUserUseCase } from "../../../domain/use-cases/user/LoginUserUseCase";
import { makeAuthProvider } from "./makeAuthProvider";

export function makeLoginUserUseCase() {
  const userRepository = new FirebaseUserRepository();
  const authProvider = makeAuthProvider();

  return new LoginUserUseCase(userRepository, authProvider);
}
