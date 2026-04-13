export type PaymentStatus = "pending" | "paid" | "overdue";

export interface MonthlyPaymentProps {
  id: string;
  studentId: string;
  userId: string;
  /** 1–12 */
  month: number;
  year: number;
  /** Dia de vencimento copiado do aluno */
  dueDay: number;
  /** Valor original da mensalidade */
  expectedValue: number;
  /** Valor efetivamente pago (pode incluir juros ou desconto) */
  paidValue?: number;
  status: PaymentStatus;
  paidAt?: Date;
  /** Observação livre: juros, desconto, etc. */
  notes?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface RegisterPaymentInput {
  studentId: string;
  month: number;
  year: number;
  paidValue: number;
  paidAt: Date;
  notes?: string;
}

export interface UpdatePaymentInput {
  paidValue?: number;
  paidAt?: Date;
  status?: PaymentStatus;
  notes?: string;
}
