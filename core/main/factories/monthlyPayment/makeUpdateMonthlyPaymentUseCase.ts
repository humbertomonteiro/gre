import { FirebaseMonthlyPaymentRepository } from "../../../infra/firebase/repositories/FirebaseMonthlyPaymentRepository";
import { UpdateMonthlyPaymentUseCase } from "../../../domain/use-cases/monthlyPayment/UpdateMonthlyPaymentUseCase";

export function makeUpdateMonthlyPaymentUseCase() {
  return new UpdateMonthlyPaymentUseCase(
    new FirebaseMonthlyPaymentRepository()
  );
}
