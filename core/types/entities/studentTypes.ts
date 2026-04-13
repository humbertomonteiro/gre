import { Student } from "../../../core/domain/entities";
import { TransactionStatus } from "./TransactionTypes";

export const GRADES = [
  "Infantil 4",
  "Infantil 5",
  "Primeiro Ano",
  "Segundo Ano",
  "Terceiro Ano",
  "Quarto Ano",
  "Quinto Ano",
  "Sexto Ano",
  "Sétimo Ano",
] as const;

export type Grade = (typeof GRADES)[number];

export interface HealthProfile {
  allergies: string[];
  medications: string[];
}

export interface PaymentHistory {
  date: Date;
  status: TransactionStatus;
  value: number;
}

export interface StudentProps {
  id: string;
  userId: string;
  classId: string;

  name: string;
  birthDate: Date;
  grade: Grade;
  schoolName: string;
  guardianName: string;
  phone: string;

  address?: string | null;
  cognitiveDifficulty?: string | null;
  schoolDifficulty?: string[] | null;
  healthProfile?: HealthProfile | null;
  reportHistory?: string[];
  supportStartDate: Date;

  monthlyPayment: number;
  paymentDay: number;
  paymentHistory?: PaymentHistory[];

  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateStudentDTO {
  userId: string;
  classId: string;
  name: string;
  birthDate: Date;
  grade: Grade;
  schoolName: string;
  guardianName: string;
  phone: string;
  monthlyPayment: number;
  paymentDay: number;
  supportStartDate: Date;

  address?: string | null;
  cognitiveDifficulty?: string | null;
  schoolDifficulty?: string[] | null;
  reportHistory?: string[];
  healthProfile?: HealthProfile | null;
}

export type UpdateStudentDTO = Partial<
  Omit<StudentProps, "id" | "userId" | "createdAt" | "updatedAt" | "age">
>;

export interface StudentRepository {
  save(student: Student): Promise<void>;
  findById(id: string): Promise<Student | null>;
  findByUserId(userId: string): Promise<Student[] | null>;
  delete(id: string): Promise<void>;
  update(id: string, updates: UpdateStudentDTO): Promise<void>;
}
