import { Student } from "../../domain/entities";
import { UpdateStudentDTO } from "../entities";

export interface StudentRepository {
  save(student: Student): Promise<void>;
  findById(id: string): Promise<Student | null>;
  findByUserId(userId: string): Promise<Student[] | null>;
  delete(id: string): Promise<void>;
  update(id: string, updates: UpdateStudentDTO): Promise<void>;
}
