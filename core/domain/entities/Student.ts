import {
  Grade,
  GRADES,
  StudentProps,
  UpdateStudentDTO,
} from "../../types/entities";
import { AppError, Result, StudentError } from "../../errors";

export class Student {
  private constructor(private readonly props: StudentProps) {}

  public static create(props: StudentProps): Result<Student> {
    try {
      const now = new Date();

      const validatedProps: StudentProps = {
        ...props,
        createdAt: props.createdAt ?? now,
        updatedAt: props.updatedAt ?? now,
      };

      const student = new Student(validatedProps);
      const validation = student.validate();

      if (!validation.isSuccess) {
        return Result.failure<Student>(
          validation.error ??
            new AppError("Erro de validação desconhecido", 400)
        );
      }

      return Result.success(student);
    } catch (error) {
      if (error instanceof StudentError) {
        return Result.failure<Student>(error);
      }

      return Result.failure<Student>(
        error instanceof AppError
          ? error
          : new AppError(
              error instanceof Error ? error.message : String(error),
              500
            )
      );
    }
  }

  public update(updates: UpdateStudentDTO): Result<Student> {
    try {
      const updatedProps: StudentProps = {
        ...this.props,
        ...updates,
        updatedAt: new Date(),
      };

      const updatedStudent = new Student(updatedProps);
      const validation = updatedStudent.validate();

      if (!validation.isSuccess) {
        return Result.failure<Student>(
          validation.error ??
            new AppError("Erro de validação desconhecido", 400)
        );
      }

      return Result.success(updatedStudent);
    } catch (error) {
      if (error instanceof StudentError) {
        return Result.failure<Student>(error);
      }

      return Result.failure<Student>(
        error instanceof AppError
          ? error
          : new AppError(
              error instanceof Error ? error.message : String(error),
              500
            )
      );
    }
  }

  private validate(): Result<void> {
    try {
      this.validateName(this.props.name);
      this.validateMonthlyPayment(this.props.monthlyPayment);
      // this.validateAge(this.props.age);
      this.validatePaymentDay(this.props.paymentDay);
      this.validateGrade(this.props.grade);
      this.validatePhone(this.props.phone);
      this.validateDates();
      this.validateHealthProfile();
      this.validateGuardian();
      this.validateSchool();
      this.validateAddress();
      this.validateCognitiveDifficulty();
      this.validateUserId();

      return Result.success<void>(undefined);
    } catch (error) {
      if (error instanceof StudentError) {
        return Result.failure<void>(error);
      }

      return Result.failure<void>(
        error instanceof AppError
          ? error
          : new AppError(
              error instanceof Error ? error.message : String(error),
              400
            )
      );
    }
  }

  private validateName(name: string): void {
    if (!name?.trim()) {
      throw new StudentError("name", "O nome do estudante é obrigatório.");
    }

    if (name.trim().length < 2) {
      throw new StudentError(
        "name",
        "O nome do estudante deve ter pelo menos 2 caracteres."
      );
    }
  }

  private validateMonthlyPayment(value: number): void {
    if (value <= 0)
      throw new StudentError(
        "monthlyPayment",
        "A mensalidade deve ser maior que zero."
      );
  }

  private validateAge(age: number): void {
    if (age < 0 || age > 120)
      throw new StudentError("age", "A idade deve estar entre 0 e 120 anos.");
  }

  private validatePaymentDay(day: number): void {
    if (day < 1 || day > 31)
      throw new StudentError(
        "paymentDay",
        "O dia de pagamento deve estar entre 1 e 31."
      );
  }

  private validateGrade(grade: string): void {
    if (!GRADES.includes(grade as Grade))
      throw new StudentError("grade", "A série/ano fornecida é inválida.");
  }

  private validatePhone(phone?: string): void {
    if (!phone?.trim()) return;

    const phoneRegex = /^[\d\s\-\(\)\+]+$/;
    if (!phoneRegex.test(phone))
      throw new StudentError(
        "phone",
        "O telefone contém caracteres inválidos."
      );

    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10)
      throw new StudentError(
        "phone",
        "O telefone deve ter pelo menos 10 dígitos."
      );
  }

  private validateDates(): void {
    const { supportStartDate, birthDate } = this.props;
    const today = new Date();

    if (supportStartDate) {
      const start = new Date(supportStartDate);
      if (start > today)
        throw new StudentError(
          "dates",
          "A data de início do suporte não pode ser futura."
        );
      if (start < new Date("2000-01-01"))
        throw new StudentError(
          "dates",
          "A data de início do suporte não pode ser anterior a 2000."
        );
    }

    if (birthDate) {
      const birth = new Date(birthDate);
      if (birth > today)
        throw new StudentError(
          "dates",
          "A data de nascimento não pode ser futura."
        );
      if (birth < new Date("1900-01-01"))
        throw new StudentError(
          "dates",
          "A data de nascimento não pode ser anterior a 1900."
        );
    }
  }

  private validateHealthProfile(): void {
    const { healthProfile } = this.props;
    if (!healthProfile) return;

    if (typeof healthProfile !== "object" || healthProfile === null)
      throw new StudentError(
        "healthProfile",
        "O perfil de saúde deve ser um objeto válido."
      );

    const { allergies, medications } = healthProfile;

    if (!Array.isArray(allergies))
      throw new StudentError(
        "healthProfile",
        "As alergias devem ser um array."
      );

    if (!Array.isArray(medications))
      throw new StudentError(
        "healthProfile",
        "Os medicamentos devem ser um array."
      );

    [...allergies, ...medications].forEach((item, i) => {
      if (typeof item !== "string" || !item.trim()) {
        throw new StudentError(
          "healthProfile",
          `Item inválido no perfil de saúde (posição ${i}).`
        );
      }
    });
  }

  private validateGuardian(): void {
    const { guardianName } = this.props;
    if (!guardianName?.trim())
      throw new StudentError(
        "guardianName",
        "O nome do responsável é obrigatório."
      );
    if (guardianName.trim().length < 2)
      throw new StudentError(
        "guardianName",
        "O nome do responsável deve ter pelo menos 2 caracteres."
      );
  }

  private validateSchool(): void {
    const { schoolName } = this.props;
    if (!schoolName?.trim())
      throw new StudentError("schoolName", "O nome da escola é obrigatório.");
    if (schoolName.trim().length < 2)
      throw new StudentError(
        "schoolName",
        "O nome da escola deve ter pelo menos 2 caracteres."
      );
  }

  private validateAddress(): void {
    const { address } = this.props;
    if (address && address.trim().length < 10)
      throw new StudentError(
        "address",
        "O endereço deve ter pelo menos 10 caracteres."
      );
  }

  private validateCognitiveDifficulty(): void {
    const { cognitiveDifficulty } = this.props;
    if (cognitiveDifficulty && cognitiveDifficulty.trim().length < 5)
      throw new StudentError(
        "cognitiveDifficulty",
        "A descrição da dificuldade cognitiva deve ter pelo menos 5 caracteres."
      );
  }

  private validateUserId(): void {
    if (!this.props.userId?.trim())
      throw new StudentError("userId", "O userId é obrigatório.");
  }

  get id() {
    return this.props.id;
  }
  get userId() {
    return this.props.userId;
  }
  get classId() {
    return this.props.classId;
  }
  get name() {
    return this.props.name;
  }
  get birthDate() {
    return this.props.birthDate;
  }
  // get age() {
  //   return this.props.age;
  // }
  get grade() {
    return this.props.grade;
  }
  get schoolName() {
    return this.props.schoolName;
  }
  get guardianName() {
    return this.props.guardianName;
  }
  get phone() {
    return this.props.phone;
  }
  get address() {
    return this.props.address;
  }
  get cognitiveDifficulty() {
    return this.props.cognitiveDifficulty;
  }
  get reportHistory() {
    return this.props.reportHistory;
  }
  get healthProfile() {
    return this.props.healthProfile;
  }
  get supportStartDate() {
    return this.props.supportStartDate;
  }
  get monthlyPayment() {
    return this.props.monthlyPayment;
  }
  get paymentDay() {
    return this.props.paymentDay;
  }
  get paymentHistory() {
    return this.props.paymentHistory;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }

  public toDTO(): Readonly<StudentProps> {
    return structuredClone(this.props);
  }
}
