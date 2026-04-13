import { UpdateUserProps } from "../entities";
import { User } from "../../domain/entities";

export interface UserRepository {
  save: (user: User) => Promise<void>;
  findByEmail: (email: string) => Promise<User>;
  findByUid: (uid: string) => Promise<User>;
  update: (uid: string, updates: UpdateUserProps) => Promise<void>;
  delete: (uid: string) => Promise<void>;
}
