import { FirebaseMonthlyPaymentRepository } from "../../../infra/firebase/repositories/FirebaseMonthlyPaymentRepository";
import { GetOverduePaymentsUseCase } from "../../../domain/use-cases/monthlyPayment/GetOverduePaymentsUseCase";

export function makeGetOverduePaymentsUseCase() {
  return new GetOverduePaymentsUseCase(
    new FirebaseMonthlyPaymentRepository()
  );
}
