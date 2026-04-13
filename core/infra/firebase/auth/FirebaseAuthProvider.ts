// infra/auth/FirebaseAuthProvider.ts
import { AuthProvider } from "../../../application/providers/AuthProvider";
import { auth } from "../config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

export class FirebaseAuthProvider implements AuthProvider {
  async register(email: string, password: string) {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return { userId: user.uid };
  }

  async login(email: string, password: string) {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    const token = await user.getIdToken();
    return { userId: user.uid, token };
  }

  async logout() {
    await signOut(auth);
  }

  async getCurrentUser() {
    const user = auth.currentUser;
    if (!user) return null;
    return { userId: user.uid, email: user.email! };
  }
}
