import { ClassEntity } from "@/core/domain/entities";

export interface ClassProps {
  id: string;
  userId: string;
  name: string;
  time: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type UpdateClassProps = Partial<ClassProps>;

export interface ClassRepository {
  save(classEntity: ClassEntity): Promise<void>;
  findById(id: string): Promise<ClassEntity | null>;
  findByUserId(userId: string): Promise<ClassEntity[] | null>;
  update(id: string, updates: UpdateClassProps): Promise<void>;
  delete(id: string): Promise<void>;
}
