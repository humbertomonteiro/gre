import { FirebaseAuthProvider } from "../../../infra/firebase/auth/FirebaseAuthProvider";
import { JWTAuthProvider } from "../../../infra/firebase/auth/JWTAuthProvider";
import { AuthProvider } from "../../../../core/application/providers/AuthProvider";

export function makeAuthProvider(): AuthProvider {
  if (process.env.NEXT_PUBLIC_USE_FIREBASE === "true") {
    return new FirebaseAuthProvider();
  }
  return new JWTAuthProvider();
}
