"use client";

import { useEffect, useState } from "react";
import {
  X,
  Save,
  Edit,
  School,
  Phone,
  Users,
  Calendar,
  FileText,
  ClipboardList,
  Trash2,
  Plus,
  Printer,
} from "lucide-react";
import { Student } from "@/core/domain/entities";
import { StudentProps, GRADES, Grade } from "@/core/types/entities";
import { useClasse } from "@/app/contexts/ClassesContext";
import { useStudent } from "../contexts/StudentsContext";
import { useNotes } from "../contexts/NotesContext";
import { makeUpdateStudentUseCase } from "@/core/main/factories/student/makeUpdateStudentUseCase";
import { useRouter } from "next/navigation";

type Tab = "dados" | "anotacoes";

interface StudentDetailsCardProps {
  student: Student;
  isOpen: boolean;
  onClose: () => void;
  mode?: "view" | "edit";
}

export default function StudentDetailsCard({
  student,
  isOpen,
  onClose,
  mode = "view",
}: StudentDetailsCardProps) {
  const router = useRouter();
  const { classes } = useClasse();
  const { updateStudent } = useStudent();
  const { notes, isLoading: notesLoading, loadNotes, addNote, removeNote } =
    useNotes();

  const [activeTab, setActiveTab] = useState<Tab>("dados");
  const [isEditing, setIsEditing] = useState(mode === "edit");
  const [editedStudent, setEditedStudent] = useState<StudentProps>(
    student.toDTO()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Note form state
  const [noteContent, setNoteContent] = useState("");
  const [noteError, setNoteError] = useState("");
  const [isSavingNote, setIsSavingNote] = useState(false);

  useEffect(() => {
    setEditedStudent(student.toDTO());
    setIsEditing(mode === "edit");
    setActiveTab("dados");
  }, [student, mode]);

  useEffect(() => {
    if (isOpen && activeTab === "anotacoes") {
      loadNotes(student.id);
    }
  }, [isOpen, activeTab, student.id]);

  if (!isOpen) return null;

  const studentClass = classes?.find((cls) => cls.id === student.classId);

  const handleSave = async () => {
    setIsLoading(true);
    setSaveError("");

    try {
      const updateStudentUsecase = makeUpdateStudentUseCase();
      const resultUpdate = await updateStudentUsecase.execute(
        student.id,
        editedStudent
      );

      if (!resultUpdate.isSuccess || !resultUpdate.value) {
        setSaveError(resultUpdate.error?.message ?? "Erro ao salvar");
        return;
      }

      updateStudent(resultUpdate.value);
      onClose();
    } catch (error) {
      setSaveError("Erro inesperado ao salvar. Tente novamente.");
      console.error("Erro ao salvar aluno:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (mode === "edit") onClose();
    else {
      setEditedStudent(student.toDTO());
      setIsEditing(false);
      setSaveError("");
    }
  };

  const handleAddNote = async () => {
    if (!noteContent.trim()) {
      setNoteError("Escreva algo antes de salvar.");
      return;
    }
    setIsSavingNote(true);
    setNoteError("");
    const { error } = await addNote(noteContent.trim(), student.id);
    if (error) {
      setNoteError(error);
    } else {
      setNoteContent("");
    }
    setIsSavingNote(false);
  };

  const handleRemoveNote = async (id: string) => {
    await removeNote(id);
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const formatDate = (date: Date | string) =>
    new Date(date).toLocaleDateString("pt-BR");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {isEditing ? "Editar Aluno" : student.name}
            </h2>
            <p className="text-slate-500 text-sm mt-0.5">
              {isEditing
                ? "Modifique os dados do aluno"
                : `${student.grade} • ${studentClass?.name ?? "Sem turma"}`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing && (
              <>
                <button
                  onClick={() =>
                    router.push(`/dashboard/student/${student.id}/contrato`)
                  }
                  title="Gerar Contrato"
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-700"
                >
                  <FileText className="w-5 h-5" />
                </button>
                <button
                  onClick={() =>
                    router.push(`/dashboard/student/${student.id}/relatorio`)
                  }
                  title="Gerar Relatório"
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-700"
                >
                  <Printer className="w-5 h-5" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* TABS (só no modo view) */}
        {!isEditing && (
          <div className="flex border-b border-slate-200 px-6">
            <button
              onClick={() => setActiveTab("dados")}
              className={`flex items-center gap-2 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "dados"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <Users className="w-4 h-4" />
              Dados
            </button>
            <button
              onClick={() => {
                setActiveTab("anotacoes");
                loadNotes(student.id);
              }}
              className={`flex items-center gap-2 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "anotacoes"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              Anotações
              {notes.length > 0 && (
                <span className="bg-blue-100 text-blue-600 text-xs rounded-full px-1.5 py-0.5">
                  {notes.length}
                </span>
              )}
            </button>
          </div>
        )}

        {/* CONTENT */}
        <div className="p-6 overflow-y-auto flex-1">
          {isEditing ? (
            /* ── EDIT MODE ── */
            <div className="space-y-4">
              <Field2
                label="Nome do Aluno"
                value={editedStudent.name}
                onChange={(v) => setEditedStudent({ ...editedStudent, name: v })}
              />
              <Field2
                label="Telefone"
                value={editedStudent.phone}
                onChange={(v) =>
                  setEditedStudent({ ...editedStudent, phone: v })
                }
              />
              <Field2
                label="Responsável"
                value={editedStudent.guardianName}
                onChange={(v) =>
                  setEditedStudent({ ...editedStudent, guardianName: v })
                }
              />
              <Field2
                label="Escola"
                value={editedStudent.schoolName}
                onChange={(v) =>
                  setEditedStudent({ ...editedStudent, schoolName: v })
                }
              />
              <Field2
                label="Endereço"
                value={editedStudent.address ?? ""}
                onChange={(v) =>
                  setEditedStudent({ ...editedStudent, address: v || null })
                }
              />

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Série/Ano
                </label>
                <select
                  value={editedStudent.grade}
                  onChange={(e) =>
                    setEditedStudent({
                      ...editedStudent,
                      grade: e.target.value as Grade,
                    })
                  }
                  className="w-full px-3 py-2 border text-gray-700 border-slate-300 rounded-lg"
                >
                  {GRADES.map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Turma
                </label>
                <select
                  value={editedStudent.classId ?? ""}
                  onChange={(e) =>
                    setEditedStudent({
                      ...editedStudent,
                      classId: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border text-gray-700 border-slate-300 rounded-lg"
                >
                  <option value="">Selecione a turma</option>
                  {classes?.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Mensalidade (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editedStudent.monthlyPayment}
                    onChange={(e) =>
                      setEditedStudent({
                        ...editedStudent,
                        monthlyPayment: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border text-gray-700 border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Dia do Pagamento
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={31}
                    value={editedStudent.paymentDay}
                    onChange={(e) =>
                      setEditedStudent({
                        ...editedStudent,
                        paymentDay: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border text-gray-700 border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Dificuldade Cognitiva
                </label>
                <textarea
                  rows={3}
                  value={editedStudent.cognitiveDifficulty ?? ""}
                  onChange={(e) =>
                    setEditedStudent({
                      ...editedStudent,
                      cognitiveDifficulty: e.target.value || null,
                    })
                  }
                  className="w-full px-3 py-2 border text-gray-700 border-slate-300 rounded-lg resize-none"
                />
              </div>

              {saveError && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                  {saveError}
                </p>
              )}
            </div>
          ) : activeTab === "dados" ? (
            /* ── VIEW MODE: DADOS ── */
            <div className="space-y-3">
              <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                <InfoRow icon={Users} label="Responsável" value={student.guardianName} />
                <InfoRow icon={Phone} label="Telefone" value={student.phone} />
                <InfoRow icon={School} label="Escola" value={student.schoolName} />
                <InfoRow icon={School} label="Série" value={student.grade} />
                <InfoRow
                  icon={Users}
                  label="Turma"
                  value={studentClass?.name ?? "Não definida"}
                />
                <InfoRow
                  icon={Calendar}
                  label="Início do atendimento"
                  value={formatDate(student.supportStartDate)}
                />
                <InfoRow
                  icon={Calendar}
                  label="Nascimento"
                  value={formatDate(student.birthDate)}
                />
              </div>

              <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                <InfoRow
                  icon={Calendar}
                  label="Mensalidade"
                  value={formatCurrency(student.monthlyPayment)}
                />
                <InfoRow
                  icon={Calendar}
                  label="Dia de pagamento"
                  value={`Todo dia ${student.paymentDay}`}
                />
              </div>

              {(student.address || student.cognitiveDifficulty) && (
                <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                  {student.address && (
                    <InfoRow icon={School} label="Endereço" value={student.address} />
                  )}
                  {student.cognitiveDifficulty && (
                    <div>
                      <p className="text-xs font-medium text-slate-500 mb-1">
                        Dificuldade Cognitiva
                      </p>
                      <p className="text-sm text-slate-700">
                        {student.cognitiveDifficulty}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* ── VIEW MODE: ANOTAÇÕES ── */
            <div className="space-y-4">
              {/* Formulário para nova anotação */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nova anotação
                </label>
                <textarea
                  rows={3}
                  value={noteContent}
                  onChange={(e) => {
                    setNoteContent(e.target.value);
                    setNoteError("");
                  }}
                  placeholder="Escreva uma anotação sobre o aluno..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-gray-700 text-sm resize-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                />
                {noteError && (
                  <p className="text-red-600 text-xs mt-1">{noteError}</p>
                )}
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleAddNote}
                    disabled={isSavingNote}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    {isSavingNote ? "Salvando..." : "Salvar anotação"}
                  </button>
                </div>
              </div>

              {/* Lista de anotações */}
              {notesLoading ? (
                <div className="text-center py-8 text-slate-400 text-sm">
                  Carregando anotações...
                </div>
              ) : notes.length === 0 ? (
                <div className="text-center py-8">
                  <ClipboardList className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">
                    Nenhuma anotação ainda.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      className="bg-white border border-slate-200 rounded-xl p-4 group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm text-slate-700 flex-1 whitespace-pre-wrap">
                          {note.content}
                        </p>
                        <button
                          onClick={() => handleRemoveNote(note.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded transition-all text-red-400 hover:text-red-600 shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-slate-400 mt-2">
                        {new Date(note.createdAt).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-50 text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
              >
                <Save className="w-4 h-4" />
                {isLoading ? "Salvando..." : "Salvar"}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-100 text-sm"
              >
                Fechar
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                <Edit className="w-4 h-4" />
                Editar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm font-medium text-slate-800">{value}</p>
      </div>
    </div>
  );
}

function Field2({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border text-gray-700 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
      />
    </div>
  );
}
