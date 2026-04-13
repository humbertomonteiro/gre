"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useUser } from "./UserContext";
import { makeGetTransactionsByUserIdUseCase } from "@/core/main/factories/transaction/makeGetTransactionsByUserIdUseCase";
import { Transaction } from "@/core/domain/entities";

interface TransactionsContextType {
  transactions: Transaction[];
  // summary: CashFlowSummary | null;
  isLoading: boolean;
  reload: () => void;
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(
  undefined
);

export function TransactionsProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  // const [summary, setSummary] = useState<CashFlowSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadData = async () => {
    if (!user?.id) return;
    setIsLoading(true);

    const getTransactions = makeGetTransactionsByUserIdUseCase();
    // const getSummary = makeGetCashFlowSummaryUseCase();

    const t = await getTransactions.execute(user.id);
    // const s = await getSummary.execute(user.id);

    if (t.isSuccess && t.value) setTransactions(t.value as Transaction[]);
    // if (s.isSuccess && s.value) setSummary(s.value);

    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [user?.id]);

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        // summary,
        isLoading,
        reload: loadData,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}

export const useTransactions = () => {
  const ctx = useContext(TransactionsContext);
  if (!ctx) {
    throw new Error(
      "useTransactions must be used within a TransactionsProvider"
    );
  }
  return ctx;
};
