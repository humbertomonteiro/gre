export type TransactionType = "income" | "expense";
export type TransactionStatus = "pending" | "paid" | "overdue";

export interface TransactionProps {
  id: string;
  userId: string;
  value: number;
  type: TransactionType;
  status: TransactionStatus;
  date: Date;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CashFlowSummary {
  cashInHand: number;
  pending: {
    previousMonths: {
      toReceive: number;
      toPay: number;
    };
    currentMonth: {
      toReceive: number;
      toPay: number;
      balance: number;
    };
  };
  totalReceipts: number;
  totalExpenses: number;
}

export type UpdateTransactionProps = Partial<TransactionProps>;
