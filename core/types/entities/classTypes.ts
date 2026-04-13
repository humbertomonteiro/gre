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
