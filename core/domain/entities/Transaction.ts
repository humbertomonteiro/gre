import { TransactionProps, UpdateTransactionProps } from "../../types/entities";
import { AppError, Result } from "../../errors";
import { TransactionError } from "../../errors/TransactionError";

export class Transaction {
  private constructor(private props: TransactionProps) {}

  // Criação da transação
  public static create(props: TransactionProps): Result<Transaction> {
    const error = this.validate(props);
    if (error) return Result.failure<Transaction>(error);

    const now = new Date();
    const validatedProps: TransactionProps = {
      ...props,
      createdAt: props.createdAt ?? now,
      updatedAt: props.updatedAt ?? now,
    };

    const transaction = new Transaction(validatedProps);
    return Result.success(transaction);
  }

  public update(updates: UpdateTransactionProps): Result<Transaction> {
    const updatedProps: TransactionProps = {
      ...this.props,
      ...updates,
      updatedAt: new Date(),
    };

    const error = Transaction.validate(updatedProps);
    if (error) return Result.failure<Transaction>(error);

    return Result.success(new Transaction(updatedProps));
  }

  // Valida as regras da transação
  private static validate(props: Partial<TransactionProps>): AppError | null {
    if (!props.userId || !props.userId.trim()) {
      return new TransactionError("userId", "O userId é obrigatório");
    }

    if (props.value !== undefined && props.value <= 0) {
      return new TransactionError("value", "O valor deve ser maior que zero");
    }

    if (props.type && !["income", "expense"].includes(props.type)) {
      return new TransactionError("type", "Tipo de transação inválido");
    }

    if (props.status && !["pending", "paid"].includes(props.status)) {
      return new TransactionError("status", "Status inválido");
    }

    if (props.date && !(props.date instanceof Date)) {
      return new TransactionError("date", "Data inválida");
    }

    return null;
  }

  // Métodos para alterar status
  public markAsPaid(): Transaction {
    return new Transaction({
      ...this.props,
      status: "paid",
      updatedAt: new Date(),
    });
  }

  public markAsPending(): Transaction {
    return new Transaction({
      ...this.props,
      status: "pending",
      updatedAt: new Date(),
    });
  }

  // Getters
  get id() {
    return this.props.id;
  }
  get userId() {
    return this.props.userId;
  }
  get value() {
    return this.props.value;
  }
  get type() {
    return this.props.type;
  }
  get status() {
    return this.props.status;
  }
  get date() {
    return this.props.date;
  }
  get description() {
    return this.props.description;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }

  public toDTO(): TransactionProps {
    return structuredClone(this.props);
  }
}
