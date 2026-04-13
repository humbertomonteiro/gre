"use client";

import { useState, useRef, useEffect } from "react";
import { Student } from "@/core/domain/entities";
import { MoreVertical, Phone, School, Users, Pencil, Trash2, Eye, AlertTriangle } from "lucide-react";
import StudentDetailsCard from "./StudentDetailsCard";
import { useClasse } from "../contexts/ClassesContext";
import { useStudent } from "../contexts/StudentsContext";
import { makeDeleteStudentUseCase } from "@/core/main/factories/student/makeDeleteStudentUseCase";

// ─── Modal de confirmação de exclusão ────────────────────────────────────────

function DeleteConfirmModal({
  student,
  onConfirm,
  onCancel,
  isLoading,
}: {
  student: Student;
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
            <h3 className="text-base font-bold text-slate-800">Apagar aluno</h3>
            <p className="text-xs text-slate-500 mt-0.5">Esta ação não pode ser desfeita</p>
          </div>
        </div>

        <p className="text-sm text-slate-600 mb-6">
          Tem certeza que deseja apagar{" "}
          <span className="font-semibold text-slate-800">{student.name}</span>?
          Todos os dados deste aluno serão removidos permanentemente.
        </p>

        <div className="flex gap-3">
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

// ─── Menu dropdown de opções ─────────────────────────────────────────────────

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
        Apagar aluno
      </button>
    </div>
  );
}

// ─── Card principal ───────────────────────────────────────────────────────────

export default function StudentCard({ student }: { student: Student }) {
  const { classes } = useClasse();
  const { deleteStudent } = useStudent();

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const studentClass = classes?.find((cls) => cls.id === student.classId);

  // Fecha o menu ao clicar fora
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const openDetails = () => {
    setMenuOpen(false);
    setMode("view");
    setIsDetailsOpen(true);
  };

  const openEdit = () => {
    setMenuOpen(false);
    setMode("edit");
    setIsDetailsOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const uc = makeDeleteStudentUseCase();
      const result = await uc.execute(student.id);
      if (result.isSuccess) {
        deleteStudent(student.id);
      }
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString("pt-BR");

  const isActive = new Date(student.supportStartDate) <= new Date();

  return (
    <>
      {showDeleteModal && (
        <DeleteConfirmModal
          student={student}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteModal(false)}
          isLoading={isDeleting}
        />
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow group">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-slate-800 truncate">
              {student.name}
            </h3>
            <div className="mt-2 space-y-1.5">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <School className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{student.grade} • {student.schoolName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Phone className="w-3.5 h-3.5 shrink-0" />
                <span>{student.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Users className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{student.guardianName}</span>
              </div>
            </div>
          </div>

          {/* Menu de opções */}
          <div className="relative ml-2 shrink-0" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors opacity-0 group-hover:opacity-100"
            >
              <MoreVertical className="w-4 h-4 text-slate-500" />
            </button>

            {menuOpen && (
              <OptionsMenu
                onView={openDetails}
                onEdit={openEdit}
                onDelete={() => { setMenuOpen(false); setShowDeleteModal(true); }}
              />
            )}
          </div>
        </div>

        {/* Status + valor */}
        <div className="flex items-center justify-between mb-3">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              isActive ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {isActive ? "Ativo" : "Pendente"}
          </span>
          <span className="text-sm font-semibold text-slate-800">
            {formatCurrency(student.monthlyPayment)}
          </span>
        </div>

        {/* Datas */}
        <div className="text-xs text-slate-400 space-y-0.5 mb-4">
          <p>Início: {formatDate(student.supportStartDate)}</p>
          <p>Turma: {studentClass?.name ?? "Não definida"}</p>
        </div>

        {/* Ações */}
        <div className="flex gap-2 pt-4 border-t border-slate-100">
          <button
            onClick={openDetails}
            className="flex-1 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
          >
            Ver detalhes
          </button>
          <button
            onClick={openEdit}
            className="flex-1 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors font-medium"
          >
            Editar
          </button>
        </div>

        <StudentDetailsCard
          student={student}
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          mode={mode}
        />
      </div>
    </>
  );
}
