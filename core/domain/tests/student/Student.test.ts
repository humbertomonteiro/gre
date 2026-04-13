import { Student } from "../../entities/Student";
import { StudentProps } from "../../../types/entities";
import { AppError, StudentError } from "../../../errors";

describe("Student Entity", () => {
  const validStudentProps: StudentProps = {
    id: "1",
    userId: "user-123",
    name: "João Silva",
    birthDate: new Date("2010-05-10"),
    age: 15,
    grade: "Sétimo Ano",
    schoolName: "Escola Modelo",
    guardianName: "Maria Silva",
    phone: "(11) 98765-4321",
    address: "Rua Exemplo, 123 - São Paulo",
    cognitiveDifficulty: "Nenhuma",
    reportHistory: [],
    healthProfile: { allergies: [], medications: [] },
    supportStartDate: new Date("2020-01-01"),
    monthlyPayment: 500,
    paymentDay: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it("deve criar um estudante válido com sucesso", () => {
    const result = Student.create(validStudentProps);

    expect(result.isSuccess).toBe(true);
    expect(result.value).toBeInstanceOf(Student);
    expect(result.value?.name).toBe("João Silva");
  });

  it("deve retornar erro se o nome for muito curto", () => {
    const props = { ...validStudentProps, name: "J" };
    const result = Student.create(props);

    expect(result.isSuccess).toBe(false);
    expect(result.error).toBeInstanceOf(StudentError);
    expect(result.error?.message).toContain("pelo menos 2 caracteres");
    expect((result.error as StudentError).field).toBe("name");
  });

  it("deve retornar erro se a mensalidade for menor ou igual a zero", () => {
    const props = { ...validStudentProps, monthlyPayment: 0 };
    const result = Student.create(props);

    expect(result.isSuccess).toBe(false);
    expect(result.error).toBeInstanceOf(AppError);
    expect(result.error?.message).toContain("maior que zero");
  });

  it("deve atualizar um estudante válido", () => {
    const student = Student.create(validStudentProps).value!;
    const updated = student.update({ name: "João Atualizado" });

    expect(updated.isSuccess).toBe(true);
    expect(updated.value?.name).toBe("João Atualizado");
  });

  it("deve retornar erro ao atualizar com nome inválido", () => {
    const student = Student.create(validStudentProps).value!;
    const updated = student.update({ name: "" });

    expect(updated.isSuccess).toBe(false);
    expect(updated.error).toBeInstanceOf(StudentError);
    expect(updated.error?.message).toContain(
      "O nome do estudante é obrigatório."
    );
  });

  it("deve retornar erro se o userId estiver ausente", () => {
    const props = { ...validStudentProps, userId: "" };
    const result = Student.create(props);

    expect(result.isSuccess).toBe(false);
    expect(result.error).toBeInstanceOf(StudentError);
    expect((result.error as StudentError).field).toBe("userId");
  });
});
