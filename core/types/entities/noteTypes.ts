export interface NoteProps {
  id: string;
  studentId: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface NoteRepository {
  save(note: import("../../domain/entities/Note").Note): Promise<void>;
  findByStudentId(studentId: string): Promise<import("../../domain/entities/Note").Note[]>;
  delete(id: string): Promise<void>;
}
