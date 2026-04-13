import { FirebaseNoteRepository } from "../../../infra/firebase/repositories/FirebaseNoteRepository";
import { DeleteNoteUseCase } from "../../../domain/use-cases/note/DeleteNoteUseCase";

export function makeDeleteNoteUseCase() {
  const noteRepository = new FirebaseNoteRepository();
  return new DeleteNoteUseCase(noteRepository);
}
