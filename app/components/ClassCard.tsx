"use client";

import { useState, useRef, useEffect } from "react";
import { Clock, MoreVertical, Users, Eye, Pencil, Trash2, AlertTriangle } from "lucide-react";
import { useStudent } from "../contexts/StudentsContext";
import { useClasse } from "../contexts/ClassesContext";
import { ClassEntity } from "@/core/domain/entities";
import ClassDetailsCard from "./DetailsClass";
import { makeUpdateClassUseCase } from "@/core/main/factories/class/makeUpdateClassUseCase";
import { makeDeleteClassUseCase } from "@/core/main/factories/class/makeDeleteClassUseCase";
import { UpdateClassProps } from "@/core/types/entities";

// ─── Modal de confirmação ─────────────────────────────────────────────────────

function DeleteConfirmModal({
  classItem,
  studentCount,
  onConfirm,
  onCancel,
  isLoading,
}: {
  classItem: ClassEntity;
  studentCount: number;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Apagar turma</h3>
            <p className="text-xs text-slate-500 mt-0.5">Esta ação não pode ser desfeita</p>
          </div>
        </div>

        <p className="text-sm text-slate-600 mb-2">
          Tem certeza que deseja apagar a turma{" "}
          <span className="font-semibold text-slate-800">{classItem.name}</span>?
        </p>

        {studentCount > 0 && (
          <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mb-4">
            Esta turma possui <strong>{studentCount} {studentCount === 1 ? "aluno" : "alunos"}</strong> vinculado{studentCount === 1 ? "" : "s"}. Os alunos não serão apagados, mas ficarão sem turma.
          </p>
        )}

        <div className="flex gap-3 mt-4">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? "Apagando…" : "Apagar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Menu dropdown ────────────────────────────────────────────────────────────

function OptionsMenu({
  onView,
  onEdit,
  onDelete,
}: {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-lg border border-slate-200 z-20 overflow-hidden">
      <button
        onClick={onView}
        className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
      >
        <Eye className="w-4 h-4 text-slate-400" />
        Ver detalhes
      </button>
      <button
        onClick={onEdit}
        className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
      >
        <Pencil className="w-4 h-4 text-slate-400" />
        Editar
      </button>
      <div className="border-t border-slate-100 my-1" />
      <button
        onClick={onDelete}
        className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
        Apagar turma
      </button>
    </div>
  );
}

// ─── Card principal ───────────────────────────────────────────────────────────

interface ClassCardProps {
  index: number;
  classItem: ClassEntity;
}

export default function ClassCard({ index, classItem }: ClassCardProps) {
  const { students } = useStudent();
  const { updateClass, deleteClass } = useClasse();

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [detailsMode, setDetailsMode] = useState<"view" | "edit">("view");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const studentCount = students?.filter((s) => s.classId === classItem.id).length ?? 0;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleViewDetails = () => {
    setMenuOpen(false);
    setDetailsMode("view");
    setIsDetailsOpen(true);
  };

  const handleEdit = () => {
    setMenuOpen(false);
    setDetailsMode("edit");
    setIsDetailsOpen(true);
  };

  const handleSaveClass = async (updatedClass: UpdateClassProps) => {
    const updateClasse = makeUpdateClassUseCase();
    const result = await updateClasse.execute(classItem.id, updatedClass);
    if (result.isSuccess && result.value) updateClass(result.value);
    setIsDetailsOpen(false);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const uc = makeDeleteClassUseCase();
      const result = await uc.execute(classItem.id);
      if (result.isSuccess) deleteClass(classItem.id);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      {showDeleteModal && (
        <DeleteConfirmModal
          classItem={classItem}
          studentCount={studentCount}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteModal(false)}
          isLoading={isDeleting}
        />
      )}

      <div
        key={index}
        className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow group"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-slate-800 truncate mb-1">
              {classItem.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>{classItem.time}</span>
            </div>
          </div>

          <div className="relative ml-2 shrink-0" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors opacity-0 group-hover:opacity-100"
            >
              <MoreVertical className="w-4 h-4 text-slate-500" />
            </button>

            {menuOpen && (
              <OptionsMenu
                onView={handleViewDetails}
                onEdit={handleEdit}
                onDelete={() => { setMenuOpen(false); setShowDeleteModal(true); }}
              />
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              classItem.isActive
                ? "bg-green-100 text-green-700"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {classItem.isActive ? "Ativa" : "Inativa"}
          </span>

          <span className="flex items-center gap-1.5 text-sm text-slate-500">
            <Users className="w-3.5 h-3.5" />
            {studentCount} {studentCount === 1 ? "aluno" : "alunos"}
          </span>
        </div>

        <div className="flex gap-2 pt-4 border-t border-slate-100">
          <button
            onClick={handleViewDetails}
            className="flex-1 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
          >
            Ver detalhes
          </button>
          <button
            onClick={handleEdit}
            className="flex-1 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors font-medium"
          >
            Editar
          </button>
        </div>
      </div>

      <ClassDetailsCard
        classItem={classItem}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onSave={handleSaveClass}
        mode={detailsMode}
      />
    </>
  );
}
