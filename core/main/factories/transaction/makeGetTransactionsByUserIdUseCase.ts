import { FirebaseTransactionRepository } from "@/core/infra/firebase/repositories/FirebaseTransactionRepository";
import { GetTransactionsByUserIdUseCase } from "../../../../core/domain/use-cases/transaction/GetTransactionsByUserIdUseCase";

export function makeGetTransactionsByUserIdUseCase() {
  const transactionRepository = new FirebaseTransactionRepository();
  return new GetTransactionsByUserIdUseCase(transactionRepository);
}
