import { DeleteUserUseCase } from "../../use-cases/user/DeleteUserUseCase";
import { AppError } from "../../../errors";

const mockUserRepository = {
  findByUid: jest.fn(),
  delete: jest.fn(),
};

describe("DeleteUserUseCase", () => {
  let useCase: DeleteUserUseCase;

  beforeEach(() => {
    jest.resetAllMocks();
    useCase = new DeleteUserUseCase(mockUserRepository as any);
  });

  it("deve deletar um usuário com sucesso", async () => {
    mockUserRepository.findByUid.mockResolvedValue({ id: "user-123" });
    mockUserRepository.delete.mockResolvedValue(undefined);

    const result = await useCase.execute("user-123");

    expect(result.isSuccess).toBe(true);
    expect(result.value).toBe("Deleted successfully");
    expect(mockUserRepository.findByUid).toHaveBeenCalledWith("user-123");
    expect(mockUserRepository.delete).toHaveBeenCalledWith("user-123");
  });

  it("deve retornar erro se o usuário não for encontrado", async () => {
    mockUserRepository.findByUid.mockResolvedValue(null);

    const result = await useCase.execute("invalid-uid");

    expect(result.isSuccess).toBe(false);
    expect(result.error).toBeInstanceOf(AppError);
    expect(result.error?.message).toBe("Usuário não encontrado");
    expect(result.error?.statusCode).toBe(404);
    expect(mockUserRepository.delete).not.toHaveBeenCalled();
  });

  it("deve retornar erro se o repositório lançar exceção ao deletar", async () => {
    mockUserRepository.findByUid.mockResolvedValue({ id: "user-123" });
    mockUserRepository.delete.mockRejectedValue(new Error("DB error"));

    const result = await useCase.execute("user-123");

    expect(result.isSuccess).toBe(false);
    expect(result.error).toBeInstanceOf(AppError);
    expect(result.error?.message).toContain(
      "Erro ao tentar deletar: Error: DB error"
    );
  });
});
