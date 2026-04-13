import { AppError, Result } from "../../../errors";
import { TransactionRepository } from "../../../types/repositories";

export class DeleteTransactionUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}
  async execute(id: string) {
    const transaction = await this.transactionRepository.findById(id);

    if (!transaction) {
      return Result.failure(new AppError("Transação não encontrada", 404));
    }

    try {
      await this.transactionRepository.delete(id);
      return Result.success("Deleted successfully");
    } catch (error) {
      return Result.failure(
        new AppError(`Erro ao tentar deletar transação: ${error}`)
      );
    }
  }
}
