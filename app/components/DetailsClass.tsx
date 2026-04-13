"use client";

import { useState, useEffect } from "react";
import { X, Save, Edit, Clock, Users, Calendar } from "lucide-react";
import { ClassEntity } from "@/core/domain/entities";
import { ClassProps } from "@/core/types/entities";
import { useStudent } from "@/app/contexts/StudentsContext";

interface ClassDetailsCardProps {
  classItem: ClassEntity;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedClass: ClassEntity) => void;
  mode?: "view" | "edit";
}

export default function ClassDetailsCard({
  classItem,
  isOpen,
  onClose,
  onSave,
  mode = "view",
}: ClassDetailsCardProps) {
  const { students } = useStudent();
  const [isEditing, setIsEditing] = useState(mode === "edit");
  const [editedClass, setEditedClass] = useState<ClassProps>(classItem.toDTO());
  const [isLoading, setIsLoading] = useState(false);

  // Reset form quando o classItem muda
  useEffect(() => {
    setEditedClass(classItem.toDTO());
    setIsEditing(mode === "edit");
  }, [classItem, mode]);

  if (!isOpen) return null;

  const classStudents =
    students?.filter((s) => s.classId === classItem.id) || [];

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const result = ClassEntity.create(editedClass);
      if (!result.isSuccess || !result.value) {
        console.error("Erro ao criar entidade:", result.error);
        return;
      }
      const data = result.value.toDTO();
      onSave(data as ClassEntity);
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao salvar turma:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (mode === "edit") {
      onClose();
    } else {
      setEditedClass(classItem.toDTO());
      setIsEditing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {isEditing ? "Editar Turma" : "Detalhes da Turma"}
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              {isEditing
                ? "Modifique os dados da turma"
                : "Informações completas da turma"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {isEditing ? (
            <div className="space-y-6">
              {/* Edit Form */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nome da Turma
                </label>
                <input
                  type="text"
                  value={editedClass.name}
                  onChange={(e) =>
                    setEditedClass({ ...editedClass, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border text-gray-700 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Digite o nome da turma"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Horário
                </label>
                <input
                  type="text"
                  value={editedClass.time}
                  onChange={(e) =>
                    setEditedClass({ ...editedClass, time: e.target.value })
                  }
                  className="w-full px-3 py-2 border text-gray-700 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: Segunda e Quarta, 14:00-16:00"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={editedClass.isActive}
                  onChange={(e) =>
                    setEditedClass({
                      ...editedClass,
                      isActive: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-sm text-slate-700">
                  Turma ativa
                </label>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* View Mode */}
              <div className="grid grid-cols-1 gap-6">
                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="font-medium text-slate-700 mb-2">
                    Informações Básicas
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-slate-500" />
                      <div>
                        <p className="text-sm text-slate-600">Horário</p>
                        <p className="font-medium text-slate-800">
                          {classItem.time}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 text-slate-500" />
                      <div>
                        <p className="text-sm text-slate-600">
                          Total de Alunos
                        </p>
                        <p className="font-medium text-slate-800">
                          {classStudents.length} aluno
                          {classStudents.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      <div>
                        <p className="text-sm text-slate-600">Status</p>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            classItem.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-slate-100 text-slate-800"
                          }`}
                        >
                          {classItem.isActive ? "Ativa" : "Inativa"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lista de Alunos */}
              {classStudents.length > 0 && (
                <div>
                  <h3 className="font-medium text-slate-700 mb-3">
                    Alunos Matriculados
                  </h3>
                  <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                    {classStudents.map((student) => (
                      <div
                        key={student.id}
                        className="p-3 border-b border-slate-100 last:border-b-0 hover:bg-slate-50"
                      >
                        <p className="font-medium text-slate-800">
                          {student.name}
                        </p>
                        <p className="text-sm text-slate-600">
                          {student.guardianName}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading || !editedClass.name.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {isLoading ? "Salvando..." : "Salvar Alterações"}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Fechar
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Editar Turma
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
