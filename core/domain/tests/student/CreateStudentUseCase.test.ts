import { CreateStudentUseCase } from "../../use-cases/student/CreateStudentUseCase";
import { Student } from "../../entities";
import { StudentError, AppError } from "../../../errors";
import { GRADES } from "../../../types/entities";

// Mock do repositório
const mockStudentRepository = {
  save: jest.fn(),
};

describe("CreateStudentUseCase", () => {
  let useCase: CreateStudentUseCase;

  const validStudentData = {
    id: "1",
    userId: "user-123",
    name: "João da Silva",
    birthDate: new Date("2015-06-10"),
    age: 10,
    grade: GRADES[2], // "Primeiro Ano"
    schoolName: "Escola Alegria",
    guardianName: "Maria Silva",
    phone: "(11) 99999-9999",
    monthlyPayment: 800,
    paymentDay: 10,
    supportStartDate: new Date("2024-01-01"),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
    useCase = new CreateStudentUseCase(mockStudentRepository as any);
  });

  it("deve criar um estudante com sucesso", async () => {
    const result = await useCase.execute(validStudentData);

    expect(result.isSuccess).toBe(true);
    expect(result.value).toBeInstanceOf(Student);
    expect(result.value?.name).toBe(validStudentData.name);
    expect(mockStudentRepository.save).toHaveBeenCalledTimes(1);
    expect(mockStudentRepository.save).toHaveBeenCalledWith(result.value);
  });

  it("deve retornar erro se o nome for inválido", async () => {
    const invalidData = { ...validStudentData, name: "A" };

    const result = await useCase.execute(invalidData);

    expect(result.isSuccess).toBe(false);
    expect(result.error).toBeInstanceOf(StudentError);
    expect((result.error as StudentError).field).toBe("name");
    expect(mockStudentRepository.save).not.toHaveBeenCalled();
  });

  it("deve retornar erro se o grade for inválido", async () => {
    const invalidData = { ...validStudentData, grade: "Oitavo Ano" as any };

    const result = await useCase.execute(invalidData);

    expect(result.isSuccess).toBe(false);
    expect(result.error).toBeInstanceOf(StudentError);
    expect((result.error as StudentError).field).toBe("grade");
    expect(mockStudentRepository.save).not.toHaveBeenCalled();
  });

  it("deve retornar erro se a data de nascimento for futura", async () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 2);

    const invalidData = { ...validStudentData, birthDate: futureDate };

    const result = await useCase.execute(invalidData);

    expect(result.isSuccess).toBe(false);
    expect(result.error).toBeInstanceOf(StudentError);
    expect((result.error as StudentError).field).toBe("dates");
    expect(mockStudentRepository.save).not.toHaveBeenCalled();
  });

  it("deve retornar erro se o repositório lançar exceção", async () => {
    mockStudentRepository.save.mockImplementationOnce(() => {
      throw new Error("Erro no banco");
    });

    const result = await useCase.execute(validStudentData);

    expect(result.isSuccess).toBe(false);
    expect(result.error).toBeInstanceOf(AppError);
    expect(result.error?.message).toContain("Erro no banco");
  });
});
