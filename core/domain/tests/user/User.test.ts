import { User } from "../../entities";
import { UserError } from "../../../errors";

describe("User Entity", () => {
  const validUserProps = {
    id: "user-1",
    name: "Humberto Silva",
    email: "humberto@email.com",
    passwordHash: "hashed_password_123",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // ✅ Teste de criação válida
  it("deve criar um usuário válido com sucesso", () => {
    const result = User.create(validUserProps);

    expect(result.isSuccess).toBe(true);
    expect(result.value).toBeInstanceOf(User);
    expect(result.value?.name).toBe(validUserProps.name);
    expect(result.value?.email).toBe(validUserProps.email);
  });

  // ❌ Nome inválido
  it("deve retornar erro se o nome for menor que 3 caracteres", () => {
    const invalidProps = { ...validUserProps, name: "AB" };
    const result = User.create(invalidProps);

    expect(result.isSuccess).toBe(false);
    expect(result.error).toBeInstanceOf(UserError);
  });

  // ❌ Email inválido
  it("deve retornar erro se o email for inválido", () => {
    const invalidProps = { ...validUserProps, email: "invalid-email" };
    const result = User.create(invalidProps);

    expect(result.isSuccess).toBe(false);
    expect(result.error).toBeInstanceOf(UserError);
  });

  // ✅ Atualização válida
  it("deve atualizar o nome do usuário com sucesso", () => {
    const user = User.create(validUserProps).value!;
    const result = user.update({ name: "Novo Nome" });

    expect(result.isSuccess).toBe(true);
    expect(result.value?.name).toBe("Novo Nome");
  });

  // ❌ Atualização com nome inválido
  it("deve retornar erro ao tentar atualizar para um nome inválido", () => {
    const user = User.create(validUserProps).value!;
    const result = user.update({ name: "A" });

    expect(result.isSuccess).toBe(false);
    expect(result.error).toBeInstanceOf(UserError);
  });

  // ✅ Teste de toDTO (sem senha)
  it("deve retornar DTO sem o campo passwordHash", () => {
    const user = User.create(validUserProps).value!;
    const dto = user.toDTO();

    expect(dto).not.toHaveProperty("passwordHash");
    expect(dto).toHaveProperty("email", validUserProps.email);
  });
});
