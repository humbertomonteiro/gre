import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "../config";
import { Note } from "@/core/domain/entities";
import { AppError } from "@/core/errors";
import { NoteProps } from "@/core/types/entities";

function convertToDate(data: unknown): unknown {
  if (data === null || data === undefined) return data;
  if (data instanceof Timestamp) return data.toDate();
  if (Array.isArray(data)) return data.map(convertToDate);
  if (typeof data === "object") {
    const converted: Record<string, unknown> = {};
    for (const key in data as object) {
      converted[key] = convertToDate((data as Record<string, unknown>)[key]);
    }
    return converted;
  }
  return data;
}

export class FirebaseNoteRepository {
  private col = "notes";

  async save(note: Note): Promise<void> {
    const docRef = doc(db, this.col, note.id);
    await setDoc(docRef, note.toDTO());
  }

  async findByStudentId(studentId: string): Promise<Note[]> {
    const q = query(
      collection(db, this.col),
      where("studentId", "==", studentId),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    if (snap.empty) return [];

    return snap.docs.map((d) => {
      const data = convertToDate(d.data()) as NoteProps;
      const result = Note.create(data);
      if (!result.isSuccess) throw result.error;
      return result.value!;
    });
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(db, this.col, id);
    await deleteDoc(docRef).catch((error) => {
      throw new AppError(`Erro ao deletar anotação: ${error.message}`, 500);
    });
  }
}
