import { DeleteTransactionUseCase } from "../../use-cases/transaction/DeleteTransactionUseCase";
import { Transaction } from "../../entities";
import { AppError } from "../../../errors";

const mockTransactionRepository = {
  findById: jest.fn(),
  delete: jest.fn(),
};

describe("DeleteTransactionUseCase", () => {
  let useCase: DeleteTransactionUseCase;
  let transaction: Transaction;

  beforeEach(() => {
    jest.resetAllMocks();
    useCase = new DeleteTransactionUseCase(mockTransactionRepository as any);

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

  it("deve deletar uma transação com sucesso", async () => {
    mockTransactionRepository.findById.mockResolvedValue(transaction);
    mockTransactionRepository.delete.mockResolvedValue(undefined);

    const result = await useCase.execute("tx-1");

    expect(result.isSuccess).toBe(true);
    expect(result.value).toBe("Deleted successfully");
    expect(mockTransactionRepository.delete).toHaveBeenCalledWith("tx-1");
  });

  it("deve retornar erro se a transação não for encontrada", async () => {
    mockTransactionRepository.findById.mockResolvedValue(null);

    const result = await useCase.execute("invalid-id");

    expect(result.isSuccess).toBe(false);
    expect(result.error).toBeInstanceOf(AppError);
    expect(result.error?.message).toBe("Transação não encontrada");
    expect(mockTransactionRepository.delete).not.toHaveBeenCalled();
  });

  it("deve retornar erro se o repositório lançar exceção", async () => {
    mockTransactionRepository.findById.mockResolvedValue(transaction);
    mockTransactionRepository.delete.mockRejectedValue(
      new Error("Erro no banco de dados")
    );

    const result = await useCase.execute("tx-1");

    expect(result.isSuccess).toBe(false);
    expect(result.error).toBeInstanceOf(AppError);
    expect(result.error?.message).toBe(
      "Erro ao tentar deletar transação: Error: Erro no banco de dados"
    );
  });
});
