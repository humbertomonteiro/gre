"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useCallback,
} from "react";
import { Note } from "@/core/domain/entities";
import { NoteProps } from "@/core/types/entities";
import { makeCreateNoteUseCase } from "@/core/main/factories/note/makeCreateNoteUseCase";
import { makeGetNotesByStudentIdUseCase } from "@/core/main/factories/note/makeGetNotesByStudentIdUseCase";
import { makeDeleteNoteUseCase } from "@/core/main/factories/note/makeDeleteNoteUseCase";
import { useUser } from "./UserContext";

interface NotesContextType {
  notes: Note[];
  isLoading: boolean;
  loadNotes: (studentId: string) => Promise<void>;
  addNote: (content: string, studentId: string) => Promise<{ error?: string }>;
  removeNote: (id: string) => Promise<{ error?: string }>;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export function NotesProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadNotes = useCallback(async (studentId: string) => {
    setIsLoading(true);
    try {
      const useCase = makeGetNotesByStudentIdUseCase();
      const result = await useCase.execute(studentId);
      if (result.isSuccess && result.value) {
        setNotes(result.value);
      } else {
        setNotes([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addNote = async (
    content: string,
    studentId: string
  ): Promise<{ error?: string }> => {
    if (!user?.id) return { error: "Usuário não autenticado" };

    const noteData: NoteProps = {
      id: crypto.randomUUID(),
      studentId,
      userId: user.id,
      content,
      createdAt: new Date(),
    };

    const useCase = makeCreateNoteUseCase();
    const result = await useCase.execute(noteData);

    if (!result.isSuccess || !result.value) {
      return { error: result.error?.message ?? "Erro ao salvar anotação" };
    }

    setNotes((prev) => [result.value!, ...prev]);
    return {};
  };

  const removeNote = async (id: string): Promise<{ error?: string }> => {
    const useCase = makeDeleteNoteUseCase();
    const result = await useCase.execute(id);

    if (!result.isSuccess) {
      return { error: result.error?.message ?? "Erro ao deletar anotação" };
    }

    setNotes((prev) => prev.filter((n) => n.id !== id));
    return {};
  };

  return (
    <NotesContext.Provider
      value={{ notes, isLoading, loadNotes, addNote, removeNote }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export const useNotes = () => {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error("useNotes must be used within a NotesProvider");
  return ctx;
};
