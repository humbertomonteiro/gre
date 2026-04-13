import { CashFlowUseCase } from "../../use-cases/transaction/CashFlowUseCase";
import { AppError } from "../../../errors";

describe("CashFlowUseCase", () => {
  const mockStudentRepository = {
    findByUserId: jest.fn(),
  };

  const mockTransactionRepository = {
    findByStudentId: jest.fn(),
  };

  const mockDateProvider = {
    now: jest.fn(),
    startOfMonth: jest.fn(),
    endOfMonth: jest.fn(),
    isBefore: jest.fn(),
  };

  const useCase = new CashFlowUseCase(
    mockStudentRepository as any,
    mockTransactionRepository as any,
    mockDateProvider as any
  );

  const userId = "user123";
  const student = { id: "student1", userId };
  const baseDate = new Date("2025-11-01T00:00:00Z");

  beforeEach(() => {
    jest.clearAllMocks();

    mockDateProvider.now.mockReturnValue(baseDate);
    mockDateProvider.startOfMonth.mockReturnValue(
      new Date("2025-11-01T00:00:00Z")
    );
    mockDateProvider.endOfMonth.mockReturnValue(
      new Date("2025-11-30T23:59:59Z")
    );
    mockDateProvider.isBefore.mockImplementation(
      (d1, d2) => d1.getTime() < d2.getTime()
    );
  });

  it("deve retornar erro se nenhum estudante for encontrado", async () => {
    mockStudentRepository.findByUserId.mockResolvedValue([]);

    const result = await useCase.execute(userId);

    expect(result.isSuccess).toBe(false);
    expect(result.error).toBeInstanceOf(AppError);
    expect(result.error?.message).toBe("Nenhum estudante encontrado");
  });

  it("deve calcular corretamente o fluxo de caixa", async () => {
    mockStudentRepository.findByUserId.mockResolvedValue([student]);

    const transactions = [
      // Receita paga (entra no caixa)
      {
        value: 1000,
        date: "2025-11-05T00:00:00Z",
        type: "income",
        status: "paid",
      },
      // Despesa paga (sai do caixa)
      {
        value: 300,
        date: "2025-11-10T00:00:00Z",
        type: "expense",
        status: "paid",
      },
      // Receita pendente mês atual
      {
        value: 200,
        date: "2025-11-15T00:00:00Z",
        type: "income",
        status: "pending",
      },
      // Despesa pendente mês atual
      {
        value: 150,
        date: "2025-11-20T00:00:00Z",
        type: "expense",
        status: "pending",
      },
      // Receita pendente mês passado
      {
        value: 500,
        date: "2025-10-10T00:00:00Z",
        type: "income",
        status: "pending",
      },
      // Despesa pendente mês passado
      {
        value: 250,
        date: "2025-10-15T00:00:00Z",
        type: "expense",
        status: "pending",
      },
    ];

    mockTransactionRepository.findByStudentId.mockResolvedValue(transactions);

    const result = await useCase.execute(userId);

    expect(result.isSuccess).toBe(true);
    const summary = result.value!;

    expect(summary.cashInHand).toBe(700); // 1000 - 300
    expect(summary.totalReceipts).toBe(1700); // 1000 + 200 + 500
    expect(summary.totalExpenses).toBe(700); // 300 + 150 + 250
    expect(summary.pending.previousMonths.toReceive).toBe(500);
    expect(summary.pending.previousMonths.toPay).toBe(250);
    expect(summary.pending.currentMonth.toReceive).toBe(200);
    expect(summary.pending.currentMonth.toPay).toBe(150);
    expect(summary.pending.currentMonth.balance).toBe(750); // 700 + 200 - 150
  });

  it("deve retornar falha se ocorrer erro inesperado", async () => {
    mockStudentRepository.findByUserId.mockRejectedValue(new Error("DB error"));

    const result = await useCase.execute(userId);

    expect(result.isSuccess).toBe(false);
    expect(result.error).toBeInstanceOf(AppError);
    expect(result.error?.message).toBe("DB error");
  });
});
