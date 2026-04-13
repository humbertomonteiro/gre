import { FirebaseUserRepository } from "../../../infra/firebase/repositories/FirebaseUserRepository";
import { BcryptHasher } from "../../../application/cryptography/BCryptHash";
import { CreateUserUseCase } from "../../../domain/use-cases/user/CreateUserUseCase";
import { makeAuthProvider } from "./makeAuthProvider";

export function makeCreateUserUseCase() {
  const userRepository = new FirebaseUserRepository();
  const passwordHasher = new BcryptHasher();
  const authProvider = makeAuthProvider();

  return new CreateUserUseCase(userRepository, passwordHasher, authProvider);
}
