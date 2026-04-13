import { MonthlyPayment } from "../../entities";
import { Result, AppError } from "../../../errors";
import { FirebaseMonthlyPaymentRepository } from "../../../infra/firebase/repositories/FirebaseMonthlyPaymentRepository";
import { MonthlyPaymentProps } from "../../../types/entities";

export class UpsertMonthlyPaymentUseCase {
  constructor(private readonly repo: FirebaseMonthlyPaymentRepository) {}

  async execute(props: MonthlyPaymentProps): Promise<Result<MonthlyPayment>> {
    const result = MonthlyPayment.create(props);
    if (!result.isSuccess || !result.value)
      return result as Result<MonthlyPayment>;

    try {
      await this.repo.save(result.value);
      return Result.success(result.value);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro ao salvar pagamento";
      return Result.failure(new AppError(msg, 500));
    }
  }
}
