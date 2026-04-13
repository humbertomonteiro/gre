import { AppError, Result } from "../../../errors";
import { Transaction } from "../../entities";
import { UpdateTransactionProps } from "../../../types/entities";
import { TransactionRepository } from "../../../types/repositories";

export class UpdateTransactionUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(
    id: string,
    updates: UpdateTransactionProps
  ): Promise<Result<Transaction>> {
    const transaction = await this.transactionRepository.findById(id);

    if (!transaction) {
      return Result.failure(new AppError("Transação não encontrada", 404));
    }

    const transactionUpdated = transaction.update(updates);
    if (!transactionUpdated.isSuccess || !transactionUpdated.value) {
      return Result.failure(transactionUpdated.error!);
    }

    try {
      await this.transactionRepository.update(id, transactionUpdated.value);
      return Result.success(transactionUpdated.value);
    } catch (error: any) {
      return Result.failure(
        new AppError(error.message || "Erro ao atualizar transação", 500)
      );
    }
  }
}
