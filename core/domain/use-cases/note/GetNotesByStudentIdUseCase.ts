import { Note } from "../../entities";
import { Result, AppError } from "../../../errors";
import { FirebaseNoteRepository } from "../../../infra/firebase/repositories/FirebaseNoteRepository";

export class GetNotesByStudentIdUseCase {
  constructor(private readonly noteRepository: FirebaseNoteRepository) {}

  async execute(studentId: string): Promise<Result<Note[]>> {
    try {
      const notes = await this.noteRepository.findByStudentId(studentId);
      return Result.success(notes);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Erro ao buscar anotações";
      return Result.failure(new AppError(msg, 500));
    }
  }
}
