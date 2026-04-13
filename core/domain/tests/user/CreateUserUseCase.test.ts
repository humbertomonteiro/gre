import { CreateUserUseCase } from "../../use-cases/user/CreateUserUseCase";
import { User } from "../../entities";
import { UserError } from "../../../errors";

// Mocks dos contratos
const mockUserRepository = {
  save: jest.fn(),
};

const mockPasswordHasher = {
  hash: jest.fn(),
};

describe("CreateUserUseCase", () => {
  let useCase: CreateUserUseCase;

  beforeEach(() => {
    jest.resetAllMocks();
    useCase = new CreateUserUseCase(
      mockUserRepository as any,
      mockPasswordHasher as any
    );
  });

  const validData = {
    name: "Humberto Silva",
    email: "humberto@email.com",
    password: "strong-password",
  };

  it("deve criar um usuário com sucesso", async () => {
    mockPasswordHasher.hash.mockResolvedValue("hashed-password");

    const result = await useCase.execute(validData);

    expect(result.isSuccess).toBe(true);
    expect(result.value).toBeInstanceOf(User);
    expect(result.value?.email).toBe(validData.email);
    expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
    expect(mockUserRepository.save).toHaveBeenCalledWith(result.value);
  });

  it("deve retornar erro se o nome for inválido", async () => {
    const invalidData = { ...validData, name: "A" };
    mockPasswordHasher.hash.mockResolvedValue("hashed-password");

    const result = await useCase.execute(invalidData);

    expect(result.isSuccess).toBe(false);
    expect(result.error).toBeInstanceOf(UserError);
    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });

  it("deve retornar erro se o email for inválido", async () => {
    const invalidData = { ...validData, email: "invalid-email" };
    mockPasswordHasher.hash.mockResolvedValue("hashed-password");

    const result = await useCase.execute(invalidData);

    expect(result.isSuccess).toBe(false);
    expect(result.error).toBeInstanceOf(UserError);
    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });

  it("deve hashear a senha antes de criar o usuário", async () => {
    mockPasswordHasher.hash.mockResolvedValue("hashed-secret");

    const result = await useCase.execute(validData);

    expect(mockPasswordHasher.hash).toHaveBeenCalledWith(validData.password);
    expect(result.value?.toDTO()).not.toHaveProperty("password");
    expect(result.value?.toDTO()).toHaveProperty("email", validData.email);
  });

  it("deve propagar erro do PasswordHasher", async () => {
    mockPasswordHasher.hash.mockRejectedValue(new Error("hash failed"));

    const result = await useCase.execute(validData);

    expect(result.isSuccess).toBe(false);
    expect(result.error?.message).toBe("hash failed");
    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });

  it("deve retornar erro se o repositório lançar uma exceção", async () => {
    mockPasswordHasher.hash.mockResolvedValue("hashed-password");
    mockUserRepository.save.mockRejectedValue(new Error("DB error"));

    const result = await useCase.execute(validData);

    expect(result.isSuccess).toBe(false);
    expect(result.error?.message).toBe("DB error");
  });
});
