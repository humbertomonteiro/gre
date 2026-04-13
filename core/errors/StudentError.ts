import { AppError } from "./AppErrors";

export type StudentErrorFild =
  | "name"
  | "monthlyPayment"
  | "paymentDay"
  | "age"
  | "grade"
  | "phone"
  | "dates"
  | "healthProfile"
  | "guardianName"
  | "schoolName"
  | "address"
  | "cognitiveDifficulty"
  | "userId";

export class StudentError extends AppError {
  constructor(
    public readonly field: StudentErrorFild,
    message: string,
    statusCode = 400
  ) {
    super(message, statusCode);
  }
}
