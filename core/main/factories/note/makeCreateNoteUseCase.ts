import { FirebaseNoteRepository } from "../../../infra/firebase/repositories/FirebaseNoteRepository";
import { CreateNoteUseCase } from "../../../domain/use-cases/note/CreateNoteUseCase";

export function makeCreateNoteUseCase() {
  const noteRepository = new FirebaseNoteRepository();
  return new CreateNoteUseCase(noteRepository);
}
