import { FirebaseMonthlyPaymentRepository } from "../../../infra/firebase/repositories/FirebaseMonthlyPaymentRepository";
import { GetMonthlyPaymentsByMonthUseCase } from "../../../domain/use-cases/monthlyPayment/GetMonthlyPaymentsByMonthUseCase";

export function makeGetMonthlyPaymentsByMonthUseCase() {
  return new GetMonthlyPaymentsByMonthUseCase(
    new FirebaseMonthlyPaymentRepository()
  );
}
