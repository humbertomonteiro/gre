import { FirebaseNoteRepository } from "../../../infra/firebase/repositories/FirebaseNoteRepository";
import { GetNotesByStudentIdUseCase } from "../../../domain/use-cases/note/GetNotesByStudentIdUseCase";

export function makeGetNotesByStudentIdUseCase() {
  const noteRepository = new FirebaseNoteRepository();
  return new GetNotesByStudentIdUseCase(noteRepository);
}
