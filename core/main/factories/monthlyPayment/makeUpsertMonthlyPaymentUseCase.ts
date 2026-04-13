import { FirebaseMonthlyPaymentRepository } from "../../../infra/firebase/repositories/FirebaseMonthlyPaymentRepository";
import { UpsertMonthlyPaymentUseCase } from "../../../domain/use-cases/monthlyPayment/UpsertMonthlyPaymentUseCase";

export function makeUpsertMonthlyPaymentUseCase() {
  return new UpsertMonthlyPaymentUseCase(
    new FirebaseMonthlyPaymentRepository()
  );
}
