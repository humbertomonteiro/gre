import { AppError, Result } from "../../errors";
import { ClassProps, UpdateClassProps } from "../../../core/types/entities";

export class ClassEntity {
  private constructor(private props: ClassProps) {}

  public static create(props: ClassProps): Result<ClassEntity> {
    const error = this.validate(props);
    if (error) return Result.failure<ClassEntity>(error);

    const now = new Date();

    const validatedProps: ClassProps = {
      ...props,
      createdAt: props.createdAt ?? now,
      updatedAt: props.updatedAt ?? now,
    };

    const classEntity = new ClassEntity(validatedProps);
    return Result.success(classEntity);
  }

  public update(updates: UpdateClassProps): Result<ClassEntity> {
    const updatedProps: ClassProps = {
      ...this.props,
      ...updates,
      id: this.props.id,
      updatedAt: new Date(),
    };

    const error = ClassEntity.validate(updatedProps);
    if (error) return Result.failure<ClassEntity>(error);

    return Result.success(new ClassEntity(updatedProps));
  }

  private static validate(props: Partial<ClassProps>): AppError | null {
    if (props.name !== undefined && props.name.trim().length < 3) {
      return new AppError("Nome da turma deve ter pelo menos 3 caracteres");
    }

    if (props.time !== undefined && props.time.trim().length < 3) {
      return new AppError("Horário inválido");
    }

    if (props.isActive !== undefined && typeof props.isActive !== "boolean") {
      return new AppError("Status inválido para a turma");
    }

    return null;
  }

  get id() {
    return this.props.id;
  }
  get name() {
    return this.props.name;
  }
  get userId() {
    return this.props.userId;
  }
  get time() {
    return this.props.time;
  }
  get isActive() {
    return this.props.isActive;
  }
  get createdAt() {
    return new Date(this.props.createdAt!);
  }
  get updatedAt() {
    return new Date(this.props.updatedAt!);
  }

  toDTO() {
    return { ...this.props };
  }
}
