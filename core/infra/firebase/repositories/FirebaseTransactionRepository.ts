import { UpdateTransactionProps } from "@/core/types/entities";
import { TransactionRepository } from "@/core/types/repositories";
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
import { Transaction } from "@/core/domain/entities";
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

export class FirebaseTransactionRepository implements TransactionRepository {
  private collection = "repositories";

  async save(transaction: Transaction): Promise<void> {
    const docRef = doc(db, this.collection, transaction.id);
    await setDoc(docRef, transaction.toDTO());
  }

  async findById(id: string): Promise<Transaction> {
    const docRef = doc(db, this.collection, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) throw new AppError("Transação não encontrada", 404);

    const data = docSnap.data();
    const transaction = Transaction.create(data as Transaction);
    if (!transaction.isSuccess) throw transaction.error;
    return transaction.value!;
  }

  async findByUserId(userId: string): Promise<Transaction[]> {
    const q = query(
      collection(db, this.collection),
      where("userId", "==", userId)
    );
    const docSnap = await getDocs(q);

    if (docSnap.empty) {
      return [];
    }

    const transactions = docSnap.docs.map((doc) => {
      const data = doc.data();
      const convertedData = convertToDate(data);

      const transaction = Transaction.create(convertedData);
      if (!transaction.isSuccess) throw transaction.error;
      return transaction.value!;
    });

    return transactions;
  }

  async update(id: string, updates: UpdateTransactionProps): Promise<void> {
    const docRef = doc(db, this.collection, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) throw new AppError("Transação não encontrada", 404);

    const data = docSnap.data();
    const transaction = Transaction.create(data as Transaction);
    if (!transaction.isSuccess) throw transaction.error;

    const updatedTransaction = transaction.value!.update(updates);
    if (!updatedTransaction.isSuccess) throw updatedTransaction.error;

    await updateDoc(docRef, updatedTransaction.value!.toDTO() as any);
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(db, this.collection, id);
    await deleteDoc(docRef).catch((error) => {
      throw new AppError(`Erro ao deletar transação: ${error.message}`, 500);
    });
  }
}
