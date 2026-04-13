import { UpdateStudentUseCase } from "../../use-cases/student/UpdateStudentUseCase";
import { AppError, Result } from "../../../errors";
import { Student } from "../../entities";
import { GRADES } from "../../../types/entities";

const mockStudentRepository = {
  findById: jest.fn(),
  update: jest.fn(),
};

describe("UpdateStudentUseCase", () => {
  let useCase: UpdateStudentUseCase;

  beforeEach(() => {
    jest.resetAllMocks();
    useCase = new UpdateStudentUseCase(mockStudentRepository as any);
  });

  const validStudentProps = {
    id: "student-123",
    userId: "user-123",
    name: "Maria Silva",
    birthDate: new Date("2015-05-20"),
    age: 10,
    grade: GRADES[6],
    schoolName: "Escola Modelo",
    guardianName: "João Silva",
    phone: "(11) 99999-9999",
    monthlyPayment: 500,
    paymentDay: 10,
    supportStartDate: new Date("2020-01-01"),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const updatedProps = {
    name: "Maria Clara Silva",
  };

  it("deve atualizar o estudante com sucesso", async () => {
    const student = Student.create(validStudentProps).value!;
    const updatedStudent = Student.create({
      ...validStudentProps,
      ...updatedProps,
    }).value!;

    student.update = jest.fn().mockReturnValue(Result.success(updatedStudent));

    mockStudentRepository.findById.mockResolvedValue(student);
    mockStudentRepository.update.mockResolvedValue(undefined);

    const result = await useCase.execute(student.id, updatedProps);

    expect(result.isSuccess).toBe(true);
    expect(result.value).toEqual(updatedStudent);
    expect(mockStudentRepository.findById).toHaveBeenCalledWith(student.id);
    expect(mockStudentRepository.update).toHaveBeenCalledWith(
      student.id,
      updatedStudent
    );
  });

  it("deve retornar erro se o estudante não for encontrado", async () => {
    mockStudentRepository.findById.mockResolvedValue(null);

    const result = await useCase.execute("student-999", updatedProps);

    expect(result.isSuccess).toBe(false);
    expect(result.error).toBeInstanceOf(AppError);
    expect(result.error?.message).toBe("Estudante não encontrado");
    expect(result.error?.statusCode).toBe(404);
    expect(mockStudentRepository.update).not.toHaveBeenCalled();
  });

  it("deve retornar erro se a validação do estudante falhar", async () => {
    const student = Student.create(validStudentProps).value!;
    const validationError = new AppError("Nome inválido");

    student.update = jest.fn().mockReturnValue(Result.failure(validationError));
    mockStudentRepository.findById.mockResolvedValue(student);

    const result = await useCase.execute(student.id, { name: "A" });

    expect(result.isSuccess).toBe(false);
    expect(result.error).toEqual(validationError);
    expect(mockStudentRepository.update).not.toHaveBeenCalled();
  });

  it("deve retornar erro se o repositório lançar exceção", async () => {
    const student = Student.create(validStudentProps).value!;
    const updatedStudent = Student.create({
      ...validStudentProps,
      ...updatedProps,
    }).value!;

    student.update = jest.fn().mockReturnValue(Result.success(updatedStudent));
    mockStudentRepository.findById.mockResolvedValue(student);
    mockStudentRepository.update.mockRejectedValue(new Error("DB error"));

    const result = await useCase.execute(student.id, updatedProps);

    expect(result.isSuccess).toBe(false);
    expect(result.error).toBeInstanceOf(AppError);
    expect(result.error?.message).toBe("DB error");
    expect(result.error?.statusCode).toBe(500);
  });
});
