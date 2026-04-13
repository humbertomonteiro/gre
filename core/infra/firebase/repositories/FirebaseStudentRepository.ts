import { StudentRepository, UpdateUserProps } from "@/core/types/entities";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../config";
import { Student } from "@/core/domain/entities";
import { AppError } from "@/core/errors";

function convertToDate(data: any): any {
  if (data === null || data === undefined) return data;

  if (data instanceof Timestamp) {
    return data.toDate();
  }

  if (Array.isArray(data)) {
    return data.map((item) => convertToDate(item));
  }

  if (typeof data === "object") {
    const converted: any = {};
    for (const key in data) {
      converted[key] = convertToDate(data[key]);
    }
    return converted;
  }

  return data;
}

export class FirebaseStudentRepository implements StudentRepository {
  private collection = "students";

  async save(student: Student): Promise<void> {
    const docRef = doc(db, this.collection, student.id);
    await setDoc(docRef, student.toDTO());
  }

  async findById(id: string): Promise<Student> {
    const docRef = doc(db, this.collection, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) throw new AppError("Estudante não encontrado", 404);

    const data = docSnap.data();
    const student = Student.create(data as Student);
    if (!student.isSuccess) throw student.error;
    return student.value!;
  }

  async findByUserId(userId: string): Promise<Student[]> {
    const q = query(
      collection(db, this.collection),
      where("userId", "==", userId)
    );
    const docSnap = await getDocs(q);

    if (docSnap.empty) {
      return [];
    }

    const students = docSnap.docs.map((doc) => {
      const data = doc.data();
      const convertedData = convertToDate(data);

      const student = Student.create(convertedData);
      if (!student.isSuccess) throw student.error;
      return student.value!;
    });

    return students;
  }

  async update(id: string, updates: UpdateUserProps): Promise<void> {
    const docRef = doc(db, this.collection, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) throw new AppError("Estudante não encontrado", 404);

    const data = docSnap.data();
    const student = Student.create(data as Student);
    if (!student.isSuccess) throw student.error;

    const updatedStudent = student.value!.update(updates);
    if (!updatedStudent.isSuccess) throw updatedStudent.error;

    await updateDoc(docRef, updatedStudent.value!.toDTO());
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(db, this.collection, id);
    await deleteDoc(docRef).catch((error) => {
      throw new AppError(`Erro ao deletar usuário: ${error.message}`, 500);
    });
  }
}
