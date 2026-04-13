import { NoteProps } from "../../types/entities/noteTypes";
import { Result, AppError } from "../../errors";
import { NoteError } from "../../errors/NoteError";

export class Note {
  private constructor(private readonly props: NoteProps) {}

  public static create(props: NoteProps): Result<Note> {
    if (!props.content?.trim()) {
      return Result.failure(
        new NoteError("content", "O conteúdo da anotação é obrigatório.")
      );
    }

    if (props.content.trim().length < 3) {
      return Result.failure(
        new NoteError("content", "A anotação deve ter pelo menos 3 caracteres.")
      );
    }

    if (!props.studentId?.trim()) {
      return Result.failure(
        new NoteError("studentId", "O studentId é obrigatório.")
      );
    }

    if (!props.userId?.trim()) {
      return Result.failure(
        new NoteError("userId", "O userId é obrigatório.")
      );
    }

    const note = new Note({
      ...props,
      createdAt: props.createdAt ?? new Date(),
    });

    return Result.success(note);
  }

  get id() {
    return this.props.id;
  }
  get studentId() {
    return this.props.studentId;
  }
  get userId() {
    return this.props.userId;
  }
  get content() {
    return this.props.content;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }

  public toDTO(): NoteProps {
    return structuredClone(this.props);
  }
}
