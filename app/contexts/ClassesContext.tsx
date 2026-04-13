import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";
import { ClassEntity } from "@/core/domain/entities";
import { makeGetClassesByUserIdUseCase } from "@/core/main/factories/class/makeGetClassesUseCase";
import { useUser } from "./UserContext";
import { ClassProps } from "@/core/types/entities";

interface ClassesContextType {
  classes: ClassEntity[];
  refresh: () => Promise<void>;
  addClass: (c: ClassProps) => void;
  updateClass: (updated: ClassEntity) => void;
  deleteClass: (id: string) => void;
}

export const ClasseContext = createContext<ClassesContextType | undefined>(
  undefined
);

export function ClassesProvider({ children }: { children: ReactNode }) {
  const [classes, setClasses] = useState<ClassEntity[]>([]);
  const { user } = useUser();

  // 1. função para buscar do backend apenas quando necessário
  const refresh = async () => {
    if (!user?.id) return;

    const getClassesUseCase = makeGetClassesByUserIdUseCase();
    const result = await getClassesUseCase.execute(user.id);

    if (result.isSuccess && result.value) {
      setClasses(result.value);
    }
  };

  // 2. busca inicial (somente 1x após saber o user.id)
  useEffect(() => {
    console.log("Passei pelo useEffect");
    refresh();
  }, [user?.id]);

  // 3. Funções reativas (não recarregam tudo)
  const addClass = (c: ClassProps) => {
    const result = ClassEntity.create(c);
    if (result.isSuccess && result.value) {
      setClasses((prev) => [...prev, result.value!]);
    }
  };

  const updateClass = (updated: ClassEntity) => {
    setClasses((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const deleteClass = (id: string) => {
    setClasses((prev) => prev.filter((c) => c.id !== id));
  };

  const value = {
    classes,
    refresh,
    addClass,
    updateClass,
    deleteClass,
  };

  return (
    <ClasseContext.Provider value={value}>{children}</ClasseContext.Provider>
  );
}

export const useClasse = () => {
  const context = useContext(ClasseContext);

  if (!context) {
    throw new Error("useClasse must be used within a ClassesProvider");
  }

  return context;
};
