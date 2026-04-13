"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { MonthlyPayment } from "@/core/domain/entities";
import { MonthlyPaymentProps, PaymentStatus, UpdatePaymentInput } from "@/core/types/entities";
import { makeGetMonthlyPaymentsByMonthUseCase } from "@/core/main/factories/monthlyPayment/makeGetMonthlyPaymentsByMonthUseCase";
import { makeUpsertMonthlyPaymentUseCase } from "@/core/main/factories/monthlyPayment/makeUpsertMonthlyPaymentUseCase";
import { makeUpdateMonthlyPaymentUseCase } from "@/core/main/factories/monthlyPayment/makeUpdateMonthlyPaymentUseCase";
import { useUser } from "./UserContext";
import { useStudent } from "./StudentsContext";
import { Student } from "@/core/domain/entities";

// ─── tipos exportados ─────────────────────────────────────────────────────────

export interface StudentPaymentView {
  student: Student;
  payment: MonthlyPaymentProps | null; // null = sem registro no Firestore
  /** Status calculado: usa o do registro se existir, senão calcula pela data */
  computedStatus: PaymentStatus | "future";
  dueDate: Date;
  expectedValue: number;
}

interface MonthlyPaymentContextType {
  // navegação de mês
  viewMonth: number; // 1–12
  viewYear: number;
  goToPrevMonth: () => void;
  goToNextMonth: () => void;

  // dados
  monthView: StudentPaymentView[];
  isLoading: boolean;

  // ações
  registerPayment: (
    student: Student,
    paidValue: number,
    paidAt: Date,
    notes?: string
  ) => Promise<{ error?: string }>;
  updatePayment: (
    paymentId: string,
    input: UpdatePaymentInput
  ) => Promise<{ error?: string }>;
  markOverdue: (student: Student) => Promise<{ error?: string }>;

  // notificações
  overdueCount: number;
  overdueItems: StudentPaymentView[];
  pendingTodayItems: StudentPaymentView[];
}

// ─── helpers ─────────────────────────────────────────────────────────────────

function computeStatus(
  payment: MonthlyPaymentProps | null,
  month: number,
  year: number,
  dueDay: number
): PaymentStatus | "future" {
  if (payment) return payment.status;

  const now = new Date();
  const nowY = now.getFullYear();
  const nowM = now.getMonth() + 1; // 1-12
  const nowD = now.getDate();

  // mês futuro
  if (year > nowY || (year === nowY && month > nowM)) return "future";

  // mês/ano passado completo
  if (year < nowY || (year === nowY && month < nowM)) return "overdue";

  // mês atual
  if (nowD >= dueDay) return "overdue";
  return "pending";
}

// ─── provider ────────────────────────────────────────────────────────────────

export function MonthlyPaymentProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const { students } = useStudent();

  const now = new Date();
  const [viewMonth, setViewMonth] = useState(now.getMonth() + 1);
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [records, setRecords] = useState<MonthlyPayment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // ── carregar registros do Firestore para o mês atual ─────────────────────
  const loadRecords = useCallback(async () => {
    if (!user?.id || students.length === 0) return;
    setIsLoading(true);
    try {
      const uc = makeGetMonthlyPaymentsByMonthUseCase();
      const result = await uc.execute(user.id, viewMonth, viewYear);
      if (result.isSuccess && result.value) setRecords(result.value);
      else setRecords([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, viewMonth, viewYear, students.length]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  // ── montar a view combinada: um item por aluno ────────────────────────────
  const monthView = useMemo<StudentPaymentView[]>(() => {
    return students
      .map((student) => {
        const payment =
          records.find((r) => r.studentId === student.id)?.toDTO() ?? null;
        const dueDay = student.paymentDay;
        const computedStatus = computeStatus(payment, viewMonth, viewYear, dueDay);
        const dueDate = new Date(viewYear, viewMonth - 1, dueDay);
        return {
          student,
          payment,
          computedStatus,
          dueDate,
          expectedValue: student.monthlyPayment,
        };
      })
      .sort((a, b) => a.student.paymentDay - b.student.paymentDay);
  }, [students, records, viewMonth, viewYear]);

  // ── notificações ──────────────────────────────────────────────────────────
  const overdueItems = useMemo(
    () => monthView.filter((v) => v.computedStatus === "overdue"),
    [monthView]
  );

  const pendingTodayItems = useMemo(() => {
    const todayDay = now.getDate();
    const isCurrentMonth =
      viewMonth === now.getMonth() + 1 && viewYear === now.getFullYear();
    if (!isCurrentMonth) return [];
    return monthView.filter(
      (v) =>
        v.computedStatus === "pending" &&
        v.student.paymentDay === todayDay
    );
  }, [monthView, viewMonth, viewYear]);

  // ── navegação ────────────────────────────────────────────────────────────
  const goToPrevMonth = () => {
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goToNextMonth = () => {
    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // ── ações ────────────────────────────────────────────────────────────────
  const registerPayment = async (
    student: Student,
    paidValue: number,
    paidAt: Date,
    notes?: string
  ): Promise<{ error?: string }> => {
    if (!user?.id) return { error: "Usuário não autenticado" };

    const existingRecord = records.find((r) => r.studentId === student.id);

    const props: MonthlyPaymentProps = existingRecord
      ? {
          ...existingRecord.toDTO(),
          paidValue,
          paidAt,
          notes: notes ?? existingRecord.notes,
          status: "paid",
          updatedAt: new Date(),
        }
      : {
          id: crypto.randomUUID(),
          studentId: student.id,
          userId: user.id,
          month: viewMonth,
          year: viewYear,
          dueDay: student.paymentDay,
          expectedValue: student.monthlyPayment,
          paidValue,
          paidAt,
          notes,
          status: "paid",
          createdAt: new Date(),
        };

    const uc = makeUpsertMonthlyPaymentUseCase();
    const result = await uc.execute(props);

    if (!result.isSuccess || !result.value) {
      return { error: result.error?.message ?? "Erro ao registrar pagamento" };
    }

    setRecords((prev) => {
      const filtered = prev.filter((r) => r.studentId !== student.id);
      return [...filtered, result.value!];
    });
    return {};
  };

  const updatePayment = async (
    paymentId: string,
    input: UpdatePaymentInput
  ): Promise<{ error?: string }> => {
    const uc = makeUpdateMonthlyPaymentUseCase();
    const result = await uc.execute(paymentId, input);

    if (!result.isSuccess) {
      return { error: result.error?.message ?? "Erro ao atualizar pagamento" };
    }

    // Atualiza localmente
    setRecords((prev) =>
      prev.map((r) => {
        if (r.id !== paymentId) return r;
        const updated = r.update(input);
        return updated.isSuccess && updated.value ? updated.value : r;
      })
    );
    return {};
  };

  const markOverdue = async (
    student: Student
  ): Promise<{ error?: string }> => {
    if (!user?.id) return { error: "Usuário não autenticado" };

    const existingRecord = records.find((r) => r.studentId === student.id);
    if (existingRecord) {
      return updatePayment(existingRecord.id, { status: "overdue" });
    }

    const props: MonthlyPaymentProps = {
      id: crypto.randomUUID(),
      studentId: student.id,
      userId: user.id,
      month: viewMonth,
      year: viewYear,
      dueDay: student.paymentDay,
      expectedValue: student.monthlyPayment,
      status: "overdue",
      createdAt: new Date(),
    };

    const uc = makeUpsertMonthlyPaymentUseCase();
    const result = await uc.execute(props);
    if (!result.isSuccess || !result.value) {
      return { error: result.error?.message ?? "Erro ao marcar como atrasado" };
    }

    setRecords((prev) => [...prev, result.value!]);
    return {};
  };

  return (
    <MonthlyPaymentContext.Provider
      value={{
        viewMonth,
        viewYear,
        goToPrevMonth,
        goToNextMonth,
        monthView,
        isLoading,
        registerPayment,
        updatePayment,
        markOverdue,
        overdueCount: overdueItems.length,
        overdueItems,
        pendingTodayItems,
      }}
    >
      {children}
    </MonthlyPaymentContext.Provider>
  );
}

// ─── context + hook ───────────────────────────────────────────────────────────

const MonthlyPaymentContext = createContext<
  MonthlyPaymentContextType | undefined
>(undefined);

export const useMonthlyPayment = () => {
  const ctx = useContext(MonthlyPaymentContext);
  if (!ctx)
    throw new Error(
      "useMonthlyPayment must be used within a MonthlyPaymentProvider"
    );
  return ctx;
};
