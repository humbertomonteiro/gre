import { UpdateUserProps, UserProps } from "../../types/entities";
import { AppError, Result, UserError } from "../../errors";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class User {
  private constructor(private props: UserProps) {}

  public static create(props: UserProps): Result<User> {
    const error = this.validate(props);
    if (error) return Result.failure<User>(error);

    const now = new Date();

    const validatedProps: UserProps = {
      ...props,
      createdAt: props.createdAt ?? now,
      updatedAt: props.updatedAt ?? now,
    };

    const user = new User(validatedProps);

    return Result.success(user);
  }

  public update(updates: UpdateUserProps): Result<User> {
    const updateProps = {
      ...this.props,
      ...updates,
      id: this.props.id,
      updatedAt: new Date(),
    };

    const error = User.validate(updateProps);

    if (error) return Result.failure<User>(error);

    const updatedUser = new User(updateProps);
    return Result.success(updatedUser);
  }

  private static validate(props: Partial<UserProps>): AppError | null {
    if (props.name !== undefined && props.name.trim().length < 3) {
      return new UserError("name", "Nome deve ter pelo menos 3 caracteres");
    }

    if (props.email !== undefined && !EMAIL_REGEX.test(props.email)) {
      return new UserError("email", "E-mail inválido");
    }

    return null;
  }

  get id() {
    return this.props.id;
  }
  get name() {
    return this.props.name;
  }
  get email() {
    return this.props.email;
  }
  get passwordHash() {
    return this.props.passwordHash;
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
