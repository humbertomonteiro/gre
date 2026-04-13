import {
  ClassRepository,
  UpdateClassProps,
  ClassProps,
} from "@/core/types/entities";
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
import { ClassEntity } from "@/core/domain/entities";
import { AppError } from "@/core/errors";

export class FirebaseClassRepository implements ClassRepository {
  private collection = "class";

  async save(classEntity: ClassEntity): Promise<void> {
    const docRef = doc(db, this.collection, classEntity.id);
    await setDoc(docRef, classEntity.toDTO());
  }

  async findById(id: string): Promise<ClassEntity | null> {
    const docRef = doc(db, this.collection, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) throw new AppError("Turma não encontrada", 404);

    const data = docSnap.data();
    const classEntity = ClassEntity.create(data as ClassProps);
    if (!classEntity.isSuccess) throw classEntity.error;

    return classEntity.value!;
  }

  async findByUserId(userId: string): Promise<ClassEntity[] | null> {
    const q = query(
      collection(db, this.collection),
      where("userId", "==", userId)
    );
    const docSnap = await getDocs(q);

    if (docSnap.empty) {
      return [];
    }

    const classes = docSnap.docs.map((doc) => {
      const data = doc.data();
      const classEntity = ClassEntity.create(data as ClassProps);
      if (!classEntity.isSuccess) throw classEntity.error;
      return classEntity.value!;
    });

    return classes;
  }

  async update(id: string, updates: UpdateClassProps): Promise<void> {
    const docRef = doc(db, this.collection, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) throw new AppError("Turma não encontrada", 404);

    const data = docSnap.data();
    const classEntity = ClassEntity.create(data as ClassProps);
    if (!classEntity.isSuccess) throw classEntity.error;

    const updatedClass = classEntity.value!.update(updates);
    if (!updatedClass.isSuccess) throw updatedClass.error;

    await updateDoc(docRef, updatedClass.value!.toDTO());
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(db, this.collection, id);
    await deleteDoc(docRef).catch((error) => {
      throw new AppError(`Erro ao deletar turma: ${error.message}`, 500);
    });
  }
}
