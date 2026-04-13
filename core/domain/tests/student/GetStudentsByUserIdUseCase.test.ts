import { GetStudentsByUserIdUseCase } from "../../use-cases/student/GetStudentsByUserIdUseCase";
import { GRADES, StudentRepository } from "../../../types/entities";
import { Student } from "../../../domain/entities";
import { AppError } from "../../../errors";

describe("GetStudentsByUserUseCase", () => {
  let mockStudentRepository: jest.Mocked<StudentRepository>;
  let useCase: GetStudentsByUserIdUseCase;

  const mockStudents = [
    Student.create({
      id: "1",
      userId: "user123",
      name: "Maria Silva",
      birthDate: new Date("2010-05-12"),
      age: 14,
      grade: GRADES[2],
      schoolName: "Escola Modelo",
      guardianName: "João Silva",
      phone: "11999999999",
      address: "Rua das Flores, 123",
      cognitiveDifficulty: "Nenhuma",
      reportHistory: [],
      healthProfile: { allergies: [], medications: [] },
      supportStartDate: new Date("2023-01-01"),
      monthlyPayment: 500,
      paymentDay: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  ];

  beforeEach(() => {
    mockStudentRepository = {
      findByUserId: jest.fn(),
      save: jest.fn(),
      findById: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(),
    };

    useCase = new GetStudentsByUserIdUseCase(mockStudentRepository);
  });

  it("deve retornar sucesso com lista de estudantes", async () => {
    const students = mockStudents
      .filter((student) => student.isSuccess && student.value !== undefined)
      .map((student) => student.value!);
    mockStudentRepository.findByUserId.mockResolvedValueOnce(students);

    const result = await useCase.execute("user123");

    expect(result.isSuccess).toBe(true);
    expect(result.value).toEqual(students);
    expect(mockStudentRepository.findByUserId).toHaveBeenCalledWith("user123");
  });

  it("deve retornar erro se não encontrar estudantes (null)", async () => {
    mockStudentRepository.findByUserId.mockResolvedValueOnce(null as any);

    const result = await useCase.execute("user123");

    expect(result.isSuccess).toBe(false);
    expect(result.error).toBeInstanceOf(AppError);
    expect(result.error?.message).toBe("Nenhum estudante encontrado");
    expect(result.error?.statusCode).toBe(404);
  });

  it("deve retornar erro se não encontrar estudantes (array vazio)", async () => {
    mockStudentRepository.findByUserId.mockResolvedValueOnce([]);

    const result = await useCase.execute("user123");

    expect(result.isSuccess).toBe(false);
    expect(result.error).toBeInstanceOf(AppError);
    expect(result.error?.message).toBe("Nenhum estudante encontrado");
    expect(result.error?.statusCode).toBe(404);
  });

  it("deve retornar erro se o repositório lançar exceção", async () => {
    mockStudentRepository.findByUserId.mockImplementationOnce(() => {
      throw new Error("Erro no banco");
    });

    const result = await useCase.execute("user123");

    expect(result.isSuccess).toBe(false);
    expect(result.error).toBeInstanceOf(AppError);
    expect(result.error?.message).toBe("Erro no banco");
    expect(result.error?.statusCode).toBe(500);
  });
});
