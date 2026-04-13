import { AppError } from "./AppErrors";

export type NoteErrorField = "content" | "studentId" | "userId";

export class NoteError extends AppError {
  constructor(
    public readonly field: NoteErrorField,
    message: string,
    statusCode = 400
  ) {
    super(message, statusCode);
  }
}
