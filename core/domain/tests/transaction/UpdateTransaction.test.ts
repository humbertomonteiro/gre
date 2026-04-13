import { UpdateTransactionUseCase } from "../../use-cases/transaction/UpdateTransactionUseCase";
import { Transaction } from "../../entities";
import { AppError } from "../../../errors";

const mockTransactionRepository = {
  findById: jest.fn(),
  update: jest.fn(),
};

describe("UpdateTransactionUseCase", () => {
  let useCase: UpdateTransactionUseCase;
  let transaction: Transaction;

  beforeEach(() => {
    jest.resetAllMocks();
    useCase = new UpdateTransactionUseCase(mockTransactionRepository as any);

    const transactionResult = Transaction.create({
      id: "tx-1",
      userId: "user-1",
      value: 100,
      type: "income",
      status: "pending",
      date: new Date(),
      description: "Mensalidade",
    });

    transaction = transactionResult.value!;
  });

  it("deve atualizar uma transação com sucesso", async () => {
    mockTransactionRepository.findById.mockResolvedValue(transaction);
    mockTransactionRepository.update.mockResolvedValue(undefined);

    const result = await useCase.execute("tx-1", { value: 150 });

    expect(result.isSuccess).toBe(true);
    expect(result.value?.value).toBe(150);
    expect(mockTransactionRepository.update).toHaveBeenCalledWith(
      "tx-1",
      expect.any(Transaction)
    );
  });

  it("deve retornar erro se a transação não for encontrada", async () => {
    mockTransactionRepository.findById.mockResolvedValue(null);

    const result = await useCase.execute("invalid-id", { value: 200 });

    expect(result.isSuccess).toBe(false);
    expect(result.error).toBeInstanceOf(AppError);
    expect(result.error?.message).toBe("Transação não encontrada");
    expect(mockTransactionRepository.update).not.toHaveBeenCalled();
  });

  it("deve retornar erro se a validação falhar ao atualizar", async () => {
    mockTransactionRepository.findById.mockResolvedValue(transaction);

    const result = await useCase.execute("tx-1", { value: 0 });

    expect(result.isSuccess).toBe(false);
    expect(result.error).toBeInstanceOf(AppError);
    expect(result.error?.message).toBe("O valor deve ser maior que zero");
    expect(mockTransactionRepository.update).not.toHaveBeenCalled();
  });

  it("deve retornar erro se o repositório lançar uma exceção", async () => {
    mockTransactionRepository.findById.mockResolvedValue(transaction);
    mockTransactionRepository.update.mockRejectedValue(
      new Error("Erro no banco de dados")
    );

    const result = await useCase.execute("tx-1", { value: 200 });

    expect(result.isSuccess).toBe(false);
    expect(result.error).toBeInstanceOf(AppError);
    expect(result.error?.message).toBe("Erro no banco de dados");
  });
});
