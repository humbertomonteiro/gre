import {
  MonthlyPaymentProps,
  PaymentStatus,
  UpdatePaymentInput,
} from "../../types/entities/monthlyPaymentTypes";
import { Result } from "../../errors";
import { MonthlyPaymentError } from "../../errors/MonthlyPaymentError";

export class MonthlyPayment {
  private constructor(private readonly props: MonthlyPaymentProps) {}

  public static create(props: MonthlyPaymentProps): Result<MonthlyPayment> {
    const err = MonthlyPayment.validate(props);
    if (err) return Result.failure(err);

    return Result.success(
      new MonthlyPayment({
        ...props,
        createdAt: props.createdAt ?? new Date(),
      })
    );
  }

  public update(input: UpdatePaymentInput): Result<MonthlyPayment> {
    const updated: MonthlyPaymentProps = {
      ...this.props,
      ...input,
      updatedAt: new Date(),
    };
    const err = MonthlyPayment.validate(updated);
    if (err) return Result.failure(err);
    return Result.success(new MonthlyPayment(updated));
  }

  private static validate(
    props: Partial<MonthlyPaymentProps>
  ): MonthlyPaymentError | null {
    if (!props.studentId?.trim())
      return new MonthlyPaymentError("studentId", "studentId é obrigatório.");

    if (!props.userId?.trim())
      return new MonthlyPaymentError("userId", "userId é obrigatório.");

    if (!props.month || props.month < 1 || props.month > 12)
      return new MonthlyPaymentError("month", "Mês inválido (1–12).");

    if (!props.year || props.year < 2000)
      return new MonthlyPaymentError("year", "Ano inválido.");

    if (!props.dueDay || props.dueDay < 1 || props.dueDay > 31)
      return new MonthlyPaymentError("dueDay", "Dia de vencimento inválido.");

    if (props.expectedValue === undefined || props.expectedValue <= 0)
      return new MonthlyPaymentError(
        "expectedValue",
        "Valor esperado deve ser maior que zero."
      );

    if (props.paidValue !== undefined && props.paidValue < 0)
      return new MonthlyPaymentError(
        "paidValue",
        "Valor pago não pode ser negativo."
      );

    const validStatuses: PaymentStatus[] = ["pending", "paid", "overdue"];
    if (!props.status || !validStatuses.includes(props.status))
      return new MonthlyPaymentError("status", "Status inválido.");

    return null;
  }

  // ── Getters ──────────────────────────────────────────────────────────────
  get id() { return this.props.id; }
  get studentId() { return this.props.studentId; }
  get userId() { return this.props.userId; }
  get month() { return this.props.month; }
  get year() { return this.props.year; }
  get dueDay() { return this.props.dueDay; }
  get expectedValue() { return this.props.expectedValue; }
  get paidValue() { return this.props.paidValue; }
  get status() { return this.props.status; }
  get paidAt() { return this.props.paidAt; }
  get notes() { return this.props.notes; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }

  public toDTO(): MonthlyPaymentProps {
    return structuredClone(this.props);
  }
}
