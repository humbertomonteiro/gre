import { AppError } from "./AppErrors";

export type MonthlyPaymentErrorField =
  | "studentId"
  | "userId"
  | "month"
  | "year"
  | "dueDay"
  | "expectedValue"
  | "paidValue"
  | "status";

export class MonthlyPaymentError extends AppError {
  constructor(
    public readonly field: MonthlyPaymentErrorField,
    message: string,
    statusCode = 400
  ) {
    super(message, statusCode);
  }
}
