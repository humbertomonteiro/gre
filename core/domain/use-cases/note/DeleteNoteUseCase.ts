import { Result, AppError } from "../../../errors";
import { FirebaseNoteRepository } from "../../../infra/firebase/repositories/FirebaseNoteRepository";

export class DeleteNoteUseCase {
  constructor(private readonly noteRepository: FirebaseNoteRepository) {}

  async execute(id: string): Promise<Result<void>> {
    try {
      await this.noteRepository.delete(id);
      return Result.success(undefined);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Erro ao deletar anotação";
      return Result.failure(new AppError(msg, 500));
    }
  }
}
