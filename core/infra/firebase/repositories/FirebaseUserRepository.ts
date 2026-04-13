import { UpdateUserProps } from "@/core/types/entities";
import { UserRepository } from "../../../types/repositories";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../config";
import { User } from "@/core/domain/entities";
import { AppError } from "@/core/errors";

export class FirebaseUserRepository implements UserRepository {
  private collection = "users";

  async save(user: User): Promise<void> {
    const docRef = doc(db, this.collection, user.id);
    await setDoc(docRef, user.toDTO());
  }

  async findByUid(id: string): Promise<User> {
    const docRef = doc(db, this.collection, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) throw new AppError("Usuário não encontrado", 404);

    const data = docSnap.data();
    const user = User.create(data as User);
    if (!user.isSuccess) throw user.error;
    return user.value!;
  }

  async findByEmail(email: string): Promise<User> {
    const q = query(
      collection(db, this.collection),
      where("email", "==", email)
    );
    const docSnap = await getDocs(q);

    const userDoc = docSnap.docs[0];
    if (!userDoc?.exists()) throw new AppError("Usuário não encontrado", 404);

    const data = userDoc.data();
    const user = User.create(data as User);
    if (!user.isSuccess) throw user.error;
    return user.value!;
  }

  async update(id: string, updates: UpdateUserProps): Promise<void> {
    const docRef = doc(db, this.collection, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) throw new AppError("Usuário não encontrado", 404);

    const data = docSnap.data();
    const user = User.create(data as User);
    if (!user.isSuccess) throw user.error;

    const updatedUser = user.value!.update(updates);
    if (!updatedUser.isSuccess) throw updatedUser.error;

    await updateDoc(docRef, updatedUser.value!.toDTO());
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(db, this.collection, id);
    await deleteDoc(docRef).catch((error) => {
      throw new AppError(`Erro ao deletar usuário: ${error.message}`, 500);
    });
  }
}
