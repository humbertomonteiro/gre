import { Transaction } from "../../entities/Transaction";
import { TransactionProps } from "../../../types/entities";
import { TransactionRepository } from "../../../types/repositories";
import { AppError, Result } from "../../../errors";

export class CreateTransactionUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(data: TransactionProps): Promise<Result<Transaction>> {
    // Cria a entidade Transaction
    const transactionOrError = Transaction.create({
      id: crypto.randomUUID(),
      userId: data.userId,
      value: data.value,
      type: data.type,
      status: data.status ?? "pending",
      date: data.date,
      description: data.description ?? "",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (!transactionOrError.isSuccess || !transactionOrError.value) {
      return transactionOrError;
    }

    const transaction = transactionOrError.value;

    try {
      await this.transactionRepository.save(transaction);
      return Result.success(transaction);
    } catch (error: any) {
      return Result.failure(
        new AppError(error.message || "Erro ao criar transação", 500)
      );
    }
  }
}
