import { AppError } from "./AppErrors";

export type UserErrorField = "name" | "email" | "password";

export class UserError extends AppError {
  constructor(
    public readonly field: UserErrorField,
    message: string,
    statusCode = 400
  ) {
    super(message, statusCode);
  }
}
