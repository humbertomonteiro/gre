import { CreateTransactionUseCase } from "../../use-cases/transaction/CreateTransactionUseCase";
import { Transaction } from "../../entities";
import { TransactionProps } from "../../../types/entities";

const mockTransactionRepository = {
  save: jest.fn(),
};

describe("CreateTransactionUseCase", () => {
  let useCase: CreateTransactionUseCase;

  beforeEach(() => {
    jest.resetAllMocks();
    useCase = new CreateTransactionUseCase(mockTransactionRepository as any);
  });

  const validTransactionData: TransactionProps = {
    id: "teste",
    userId: "student-1",
    value: 100,
    status: "pending",
    type: "income" as const,
    date: new Date(),
    description: "Mensalidade",
  };

  it("should create a transaction successfully", async () => {
    const result = await useCase.execute(validTransactionData);

    expect(result.isSuccess).toBe(true);
    expect(result.value).toBeInstanceOf(Transaction);
    expect(mockTransactionRepository.save).toHaveBeenCalledWith(result.value);
  });

  it("should return error if transaction creation fails", async () => {
    const invalidData = { ...validTransactionData, value: 0 };

    const result = await useCase.execute(invalidData);

    expect(result.isSuccess).toBe(false);
    expect(result.error?.message).toBe("O valor deve ser maior que zero");
    expect(mockTransactionRepository.save).not.toHaveBeenCalled();
  });

  it("should set status to pending by default", async () => {
    const { status, ...dataWithoutStatus } = validTransactionData;

    const result = await useCase.execute(dataWithoutStatus as TransactionProps);

    expect(result.isSuccess).toBe(true);
    expect(result.value?.status).toBe("pending");
  });
});
