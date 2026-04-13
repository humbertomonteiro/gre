import { Result, AppError } from "../../../errors";
import { FirebaseMonthlyPaymentRepository } from "../../../infra/firebase/repositories/FirebaseMonthlyPaymentRepository";
import { UpdatePaymentInput } from "../../../types/entities";

export class UpdateMonthlyPaymentUseCase {
  constructor(private readonly repo: FirebaseMonthlyPaymentRepository) {}

  async execute(
    id: string,
    input: UpdatePaymentInput
  ): Promise<Result<void>> {
    try {
      await this.repo.update(id, input);
      return Result.success(undefined);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro ao atualizar pagamento";
      return Result.failure(new AppError(msg, 500));
    }
  }
}
