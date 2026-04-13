import { AppError } from "./AppErrors";

export type TransactionErrorField =
  | "userId"
  | "value"
  | "type"
  | "status"
  | "date";

export class TransactionError extends AppError {
  constructor(
    public readonly field: TransactionErrorField,
    message: string,
    statusCode = 400
  ) {
    super(message, statusCode);
  }
}
