"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";
import { Student } from "@/core/domain/entities";
import { makeGetTudentByUserIdUseCase } from "@/core/main/factories/student/makeGetStudentsByUserIdUseCase";
import { useUser } from "./UserContext";
import { StudentProps } from "@/core/types/entities";

export interface BirthdayInfo {
  id: string;
  name: string;
  birthDate: Date;
  nextBirthday: Date;
  ageTurning: number;
}

interface StudentsContextType {
  students: Student[];
  birthdays: BirthdayInfo[];
  upcomingBirthdays: BirthdayInfo[];
  refresh: () => Promise<void>;
  addStudent: (s: StudentProps) => void;
  updateStudent: (updated: Student) => void;
  deleteStudent: (id: string) => void;
}

export const StudentContext = createContext<StudentsContextType | undefined>(
  undefined
);

export function StudentsProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [birthdays, setBirthdays] = useState<BirthdayInfo[]>([]);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState<BirthdayInfo[]>(
    []
  );
  const { user } = useUser();

  // Função para buscar do backend
  const refresh = async () => {
    if (!user?.id) return;

    const getStudentsUseCase = makeGetTudentByUserIdUseCase();
    const result = await getStudentsUseCase.execute(user.id);

    if (result.isSuccess && result.value) {
      const allStudents = result.value;
      setStudents(allStudents);

      const allBirthdays = calculateBirthdays(allStudents);
      setBirthdays(allBirthdays);

      const upcoming = filterUpcomingBirthdays(allBirthdays);
      setUpcomingBirthdays(upcoming);
    } else {
      console.log(result.value)
    }
  };

  useEffect(() => {
    refresh();
  }, [user?.id]);

  // CRUD local (não busca backend)
  const addStudent = (s: StudentProps) => {
    const result = Student.create(s);
    if (result.isSuccess && result.value) {
      setStudents((prev) => [...prev, result.value!]);

      // recalcula birthdays
      const updated = calculateBirthdays([...students, result.value!]);
      setBirthdays(updated);
      setUpcomingBirthdays(filterUpcomingBirthdays(updated));
    }
  };

  const updateStudent = (updated: Student) => {
    const newList = students.map((s) => (s.id === updated.id ? updated : s));
    setStudents(newList);

    // recalcula birthdays
    const updatedBirthdays = calculateBirthdays(newList);
    setBirthdays(updatedBirthdays);
    setUpcomingBirthdays(filterUpcomingBirthdays(updatedBirthdays));
  };

  const deleteStudent = (id: string) => {
    const newList = students.filter((s) => s.id !== id);
    setStudents(newList);

    // recalcula birthdays
    const updatedBirthdays = calculateBirthdays(newList);
    setBirthdays(updatedBirthdays);
    setUpcomingBirthdays(filterUpcomingBirthdays(updatedBirthdays));
  };

  // ---------- Helpers ----------
  function calculateBirthdays(students: Student[]): BirthdayInfo[] {
    const today = new Date();

    return students
      .map((s) => {
        const birth = new Date(s.birthDate);

        // aniversário deste ano
        let next = new Date(
          today.getFullYear(),
          birth.getMonth(),
          birth.getDate()
        );

        // se já passou → próximo ano
        if (next < today) {
          next = new Date(
            today.getFullYear() + 1,
            birth.getMonth(),
            birth.getDate()
          );
        }

        const ageTurning = next.getFullYear() - birth.getFullYear();

        return {
          id: s.id,
          name: s.name,
          birthDate: birth,
          nextBirthday: next,
          ageTurning,
        };
      })
      .sort((a, b) => a.nextBirthday.getTime() - b.nextBirthday.getTime());
  }

  function filterUpcomingBirthdays(bdays: BirthdayInfo[]): BirthdayInfo[] {
    const today = new Date();
    const currentMonth = today.getMonth();

    return bdays.filter((b) => b.nextBirthday.getMonth() === currentMonth);
  }

  const value = {
    students,
    birthdays,
    upcomingBirthdays,
    refresh,
    addStudent,
    updateStudent,
    deleteStudent,
  };

  return (
    <StudentContext.Provider value={value}>{children}</StudentContext.Provider>
  );
}

export const useStudent = () => {
  const context = useContext(StudentContext);

  if (!context) {
    throw new Error("useStudent must be used within a StudentsProvider");
  }

  return context;
};
