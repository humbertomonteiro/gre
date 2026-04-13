import { Note } from "../../entities";
import { NoteProps } from "../../../types/entities";
import { Result, AppError } from "../../../errors";
import { FirebaseNoteRepository } from "../../../infra/firebase/repositories/FirebaseNoteRepository";

export class CreateNoteUseCase {
  constructor(private readonly noteRepository: FirebaseNoteRepository) {}

  async execute(data: NoteProps): Promise<Result<Note>> {
    const noteOrError = Note.create(data);

    if (!noteOrError.isSuccess || !noteOrError.value) {
      return noteOrError;
    }

    try {
      await this.noteRepository.save(noteOrError.value);
      return Result.success(noteOrError.value);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Erro ao salvar anotação";
      return Result.failure(new AppError(msg));
    }
  }
}
