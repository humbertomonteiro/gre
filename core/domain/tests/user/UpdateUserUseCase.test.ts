import { UpdateUserUseCase } from "../../use-cases/user/UpdateUserUseCase";
import { AppError, Result } from "../../../errors";
import { User } from "../../entities";

const mockUserRepository = {
  findByUid: jest.fn(),
  update: jest.fn(),
};

describe("UpdateUserUseCase", () => {
  let useCase: UpdateUserUseCase;

  beforeEach(() => {
    jest.resetAllMocks();
    useCase = new UpdateUserUseCase(mockUserRepository as any);
  });

  const validUserProps = {
    id: "user-123",
    name: "Humberto Silva",
    email: "humberto@email.com",
    passwordHash: "hashed-password",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const updatedProps = {
    name: "Humberto Atualizado",
  };

  it("deve atualizar o usuário com sucesso", async () => {
    const user = User.create(validUserProps).value!;
    const updatedUser = User.create({
      ...validUserProps,
      ...updatedProps,
    }).value!;

    user.update = jest.fn().mockReturnValue(Result.success(updatedUser));

    mockUserRepository.findByUid.mockResolvedValue(user);
    mockUserRepository.update.mockResolvedValue(undefined);

    const result = await useCase.execute(user.id, updatedProps);

    expect(result.isSuccess).toBe(true);
    expect(result.value).toEqual(updatedUser);
    expect(mockUserRepository.findByUid).toHaveBeenCalledWith(user.id);
    expect(mockUserRepository.update).toHaveBeenCalledWith(
      user.id,
      updatedUser
    );
  });

  it("deve retornar erro se o usuário não for encontrado", async () => {
    mockUserRepository.findByUid.mockResolvedValue(null);

    const result = await useCase.execute("user-999", updatedProps);

    expect(result.isSuccess).toBe(false);
    expect(result.error).toBeInstanceOf(AppError);
    expect(result.error?.message).toBe("Usuário não encontrado");
    expect(result.error?.statusCode).toBe(404);
    expect(mockUserRepository.update).not.toHaveBeenCalled();
  });

  it("deve retornar erro se a validação do usuário falhar", async () => {
    const user = User.create(validUserProps).value!;
    const validationError = new AppError("Nome inválido");

    user.update = jest.fn().mockReturnValue(Result.failure(validationError));
    mockUserRepository.findByUid.mockResolvedValue(user);

    const result = await useCase.execute(user.id, { name: "A" });

    expect(result.isSuccess).toBe(false);
    expect(result.error).toEqual(validationError);
    expect(mockUserRepository.update).not.toHaveBeenCalled();
  });

  it("deve retornar erro se o repositório lançar exceção", async () => {
    const user = User.create(validUserProps).value!;
    const updatedUser = User.create({
      ...validUserProps,
      ...updatedProps,
    }).value!;

    user.update = jest.fn().mockReturnValue(Result.success(updatedUser));
    mockUserRepository.findByUid.mockResolvedValue(user);
    mockUserRepository.update.mockRejectedValue(new Error("DB error"));

    const result = await useCase.execute(user.id, updatedProps);

    expect(result.isSuccess).toBe(false);
    expect(result.error).toBeInstanceOf(AppError);
    expect(result.error?.message).toBe("DB error");
    expect(result.error?.statusCode).toBe(500);
  });
});
