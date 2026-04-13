import { MonthlyPayment } from "../../entities";
import { Result, AppError } from "../../../errors";
import { FirebaseMonthlyPaymentRepository } from "../../../infra/firebase/repositories/FirebaseMonthlyPaymentRepository";

export class GetOverduePaymentsUseCase {
  constructor(private readonly repo: FirebaseMonthlyPaymentRepository) {}

  async execute(userId: string): Promise<Result<MonthlyPayment[]>> {
    try {
      const payments = await this.repo.findOverdueByUser(userId);
      return Result.success(payments);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro ao buscar pagamentos em atraso";
      return Result.failure(new AppError(msg, 500));
    }
  }
}
