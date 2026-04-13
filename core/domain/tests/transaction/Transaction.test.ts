import { Transaction } from "../../entities/Transaction";
import { TransactionProps } from "../../../types/entities";
import { TransactionError } from "../../../errors";

describe("Transaction entity", () => {
  const validProps: TransactionProps = {
    id: "txn-1",
    userId: "user-1",
    value: 100,
    type: "income",
    status: "pending",
    date: new Date(),
    description: "Mensalidade",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it("should create a transaction successfully", () => {
    const result = Transaction.create(validProps);
    expect(result.isSuccess).toBe(true);
    expect(result.value).toBeInstanceOf(Transaction);
    expect(result.value?.value).toBe(validProps.value);
  });

  it("should fail if value is less than or equal to 0", () => {
    const result = Transaction.create({ ...validProps, value: 0 });
    expect(result.isSuccess).toBe(false);
    expect(result.error).toBeInstanceOf(TransactionError);
    expect(result.error?.message).toBe("O valor deve ser maior que zero");
  });

  it("should fail if userId is empty", () => {
    const result = Transaction.create({ ...validProps, userId: "" });
    expect(result.isSuccess).toBe(false);
    expect(result.error).toBeInstanceOf(TransactionError);
    expect(result.error?.message).toBe("O userId é obrigatório");
  });

  it("should fail if type is invalid", () => {
    const result = Transaction.create({ ...validProps, type: "other" as any });
    expect(result.isSuccess).toBe(false);
    expect(result.error).toBeInstanceOf(TransactionError);
    expect(result.error?.message).toBe("Tipo de transação inválido");
  });

  it("should fail if status is invalid", () => {
    const result = Transaction.create({ ...validProps, status: "done" as any });
    expect(result.isSuccess).toBe(false);
    expect(result.error).toBeInstanceOf(TransactionError);
    expect(result.error?.message).toBe("Status inválido");
  });

  it("should update a transaction successfully", () => {
    const transaction = Transaction.create(validProps).value!;
    const updateResult = transaction.update({
      value: 200,
      description: "Ajuste",
    });
    expect(updateResult.isSuccess).toBe(true);
    expect(updateResult.value?.value).toBe(200);
    expect(updateResult.value?.description).toBe("Ajuste");
  });

  it("should fail update if value is invalid", () => {
    const transaction = Transaction.create(validProps).value!;
    const updateResult = transaction.update({ value: -50 });
    expect(updateResult.isSuccess).toBe(false);
    expect(updateResult.error).toBeInstanceOf(TransactionError);
    expect(updateResult.error?.message).toBe("O valor deve ser maior que zero");
  });

  it("should mark transaction as paid", () => {
    const transaction = Transaction.create(validProps).value!;
    const paidTransaction = transaction.markAsPaid();
    expect(paidTransaction.status).toBe("paid");
  });

  it("should mark transaction as pending", () => {
    const transaction = Transaction.create(validProps).value!;
    const pendingTransaction = transaction.markAsPending();
    expect(pendingTransaction.status).toBe("pending");
  });

  it("toDTO should return a clone of the transaction props", () => {
    const transaction = Transaction.create(validProps).value!;
    const dto = transaction.toDTO();
    expect(dto).toEqual(validProps);
    expect(dto).not.toBe(transaction); // garante clone, não referência
  });
});
