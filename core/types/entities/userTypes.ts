export interface UserProps {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  updatedAt?: Date;
  createdAt?: Date;
}

export type UpdateUserProps = Partial<UserProps>;
