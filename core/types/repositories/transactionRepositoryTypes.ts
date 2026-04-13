import { Transaction } from "../../domain/entities";
import { UpdateTransactionProps } from "../entities";

export interface TransactionRepository {
  save: (transaction: Transaction) => Promise<void>;
  findByUserId(studentId: string): Promise<Transaction[]>;
  update: (id: string, updates: UpdateTransactionProps) => Promise<void>;
  findById(id: string): Promise<Transaction | null>;
  delete: (id: string) => Promise<void>;
}
