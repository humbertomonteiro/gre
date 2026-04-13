import { LoginUserUseCase } from "../../use-cases/user/LoginUserUseCase";
import { AppError } from "../../../errors";
import { User } from "../../entities";

// Mock do repositório e do hasher
const mockUserRepository = {
  findByEmail: jest.fn(),
};

const mockPasswordHasher = {
  compare: jest.fn(),
};

describe("LoginUserUseCase", () => {
  let useCase: LoginUserUseCase;

  beforeEach(() => {
    jest.resetAllMocks();
    useCase = new LoginUserUseCase(
      mockUserRepository as any,
      mockPasswordHasher as any
    );
  });

  const validUserProps = {
    id: "user-123",
    name: "Humberto Silva",
    email: "humberto@email.com",
    passwordHash: "hashed-password",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const validLoginData = {
    email: "humberto@email.com",
    password: "plain-password",
  };

  it("deve fazer login com sucesso e retornar um token", async () => {
    const user = User.create(validUserProps).value!;
    mockUserRepository.findByEmail.mockResolvedValue(user);
    mockPasswordHasher.compare.mockResolvedValue(true);

    const result = await useCase.execute(validLoginData);

    expect(result.isSuccess).toBe(true);
    expect(result.value).toBe("fake-jwt-token");
    expect(mockPasswordHasher.compare).toHaveBeenCalledWith(
      validLoginData.password,
      user.passwordHash
    );
  });

  it("deve retornar erro se o usuário não for encontrado", async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);

    const result = await useCase.execute(validLoginData);

    expect(result.isSuccess).toBe(false);
    expect(result.error).toBeInstanceOf(AppError);
    expect(result.error?.message).toBe("Usuário não encontrado");
    expect(result.error?.statusCode).toBe(404);
    expect(mockPasswordHasher.compare).not.toHaveBeenCalled();
  });

  it("deve retornar erro se a senha for incorreta", async () => {
    const user = User.create(validUserProps).value!;
    mockUserRepository.findByEmail.mockResolvedValue(user);
    mockPasswordHasher.compare.mockResolvedValue(false);

    const result = await useCase.execute(validLoginData);

    expect(result.isSuccess).toBe(false);
    expect(result.error).toBeInstanceOf(AppError);
    expect(result.error?.message).toBe("Senha incorreta");
    expect(result.error?.statusCode).toBe(401);
  });

  it("deve propagar erro se o PasswordHasher lançar uma exceção", async () => {
    const user = User.create(validUserProps).value!;
    mockUserRepository.findByEmail.mockResolvedValue(user);
    mockPasswordHasher.compare.mockRejectedValue(new Error("bcrypt failed"));

    await expect(useCase.execute(validLoginData)).rejects.toThrow(
      "bcrypt failed"
    );
  });
});
