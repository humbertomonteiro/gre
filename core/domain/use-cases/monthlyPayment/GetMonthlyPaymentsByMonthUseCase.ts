import { MonthlyPayment } from "../../entities";
import { Result, AppError } from "../../../errors";
import { FirebaseMonthlyPaymentRepository } from "../../../infra/firebase/repositories/FirebaseMonthlyPaymentRepository";

export class GetMonthlyPaymentsByMonthUseCase {
  constructor(private readonly repo: FirebaseMonthlyPaymentRepository) {}

  async execute(
    userId: string,
    month: number,
    year: number
  ): Promise<Result<MonthlyPayment[]>> {
    try {
      const payments = await this.repo.findByUserAndMonth(userId, month, year);
      return Result.success(payments);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro ao buscar pagamentos";
      return Result.failure(new AppError(msg, 500));
    }
  }
}
