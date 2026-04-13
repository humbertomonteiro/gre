"use client";

import { UserProvider } from "./contexts/UserContext";
import { StudentsProvider } from "./contexts/StudentsContext";
import { ClassesProvider } from "./contexts/ClassesContext";
import { TransactionsProvider } from "./contexts/TransactionContext";
import { NotesProvider } from "./contexts/NotesContext";
import { MonthlyPaymentProvider } from "./contexts/MonthlyPaymentContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <StudentsProvider>
        <ClassesProvider>
          <TransactionsProvider>
            <MonthlyPaymentProvider>
              <NotesProvider>{children}</NotesProvider>
            </MonthlyPaymentProvider>
          </TransactionsProvider>
        </ClassesProvider>
      </StudentsProvider>
    </UserProvider>
  );
}
