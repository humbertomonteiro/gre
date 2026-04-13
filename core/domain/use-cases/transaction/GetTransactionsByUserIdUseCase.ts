// import { Transaction } from "../../entities";
import { TransactionProps } from "@/core/types/entities";
import { TransactionRepository } from "../../../types/repositories";
import { AppError, Result } from "../../../errors";

export class GetTransactionsByUserIdUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(userId: string): Promise<Result<TransactionProps[]>> {
    try {
      const transactions = await this.transactionRepository.findByUserId(
        userId
      );

      if (!transactions || transactions.length === 0) {
        return Result.failure(new AppError("Nenhum transação encontrado", 404));
      }

      return Result.success(transactions);
    } catch (error: any) {
      return Result.failure(
        new AppError(error.message || "Erro ao buscar transações", 500)
      );
    }
  }
}
