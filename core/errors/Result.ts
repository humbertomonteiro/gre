import { AppError } from "./AppErrors";

export class Result<T> {
  private constructor(
    public readonly isSuccess: boolean,
    public readonly value?: T,
    public readonly error?: AppError
  ) {}

  static success<T>(value: T): Result<T> {
    return new Result<T>(true, value);
  }

  static failure<T>(error: AppError): Result<T> {
    return new Result<T>(false, undefined, error);
  }

  static multipleErrors<T>(errors: AppError[]): Result<T> {
    const mainError = errors[0];
    return new Result<T>(false, undefined, mainError);
  }
}
