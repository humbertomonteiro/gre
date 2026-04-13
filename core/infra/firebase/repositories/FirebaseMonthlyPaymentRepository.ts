import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../config";
import { MonthlyPayment } from "@/core/domain/entities";
import { AppError } from "@/core/errors";
import { MonthlyPaymentProps, UpdatePaymentInput } from "@/core/types/entities";

function convertToDate(data: unknown): unknown {
  if (data === null || data === undefined) return data;
  if (data instanceof Timestamp) return data.toDate();
  if (Array.isArray(data)) return data.map(convertToDate);
  if (typeof data === "object") {
    const out: Record<string, unknown> = {};
    for (const k in data as object)
      out[k] = convertToDate((data as Record<string, unknown>)[k]);
    return out;
  }
  return data;
}

export class FirebaseMonthlyPaymentRepository {
  private col = "monthlyPayments";

  async save(payment: MonthlyPayment): Promise<void> {
    const ref = doc(db, this.col, payment.id);
    await setDoc(ref, payment.toDTO());
  }

  async update(id: string, input: UpdatePaymentInput): Promise<void> {
    const ref = doc(db, this.col, id);
    await updateDoc(ref, { ...input, updatedAt: new Date() });
  }

  /** Todos os pagamentos de um usuário em determinado mês/ano */
  async findByUserAndMonth(
    userId: string,
    month: number,
    year: number
  ): Promise<MonthlyPayment[]> {
    const q = query(
      collection(db, this.col),
      where("userId", "==", userId),
      where("month", "==", month),
      where("year", "==", year)
    );
    const snap = await getDocs(q);
    if (snap.empty) return [];

    return snap.docs.map((d) => {
      const data = convertToDate(d.data()) as MonthlyPaymentProps;
      const result = MonthlyPayment.create(data);
      if (!result.isSuccess) throw result.error;
      return result.value!;
    });
  }

  /** Todos os pagamentos em atraso de um usuário (para notificações) */
  async findOverdueByUser(userId: string): Promise<MonthlyPayment[]> {
    const q = query(
      collection(db, this.col),
      where("userId", "==", userId),
      where("status", "==", "overdue")
    );
    const snap = await getDocs(q);
    if (snap.empty) return [];

    return snap.docs.map((d) => {
      const data = convertToDate(d.data()) as MonthlyPaymentProps;
      const result = MonthlyPayment.create(data);
      if (!result.isSuccess) throw result.error;
      return result.value!;
    });
  }

  /** Histórico completo de um aluno */
  async findByStudent(studentId: string): Promise<MonthlyPayment[]> {
    const q = query(
      collection(db, this.col),
      where("studentId", "==", studentId)
    );
    const snap = await getDocs(q);
    if (snap.empty) return [];

    return snap.docs.map((d) => {
      const data = convertToDate(d.data()) as MonthlyPaymentProps;
      const result = MonthlyPayment.create(data);
      if (!result.isSuccess) throw result.error;
      return result.value!;
    });
  }

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, this.col, id)).catch((e) => {
      throw new AppError(`Erro ao deletar pagamento: ${e.message}`, 500);
    });
  }
}
