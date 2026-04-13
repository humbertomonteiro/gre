import { ClassEntity } from "@/core/domain/entities";
import { UpdateClassProps } from "../entities";

export interface ClassRepository {
  save(classEntity: ClassEntity): Promise<void>;
  findById(id: string): Promise<ClassEntity | null>;
  findByUserId(classId: string): Promise<ClassEntity[] | null>;
  delete(id: string): Promise<void>;
  update(id: string, updates: UpdateClassProps): Promise<void>;
}
