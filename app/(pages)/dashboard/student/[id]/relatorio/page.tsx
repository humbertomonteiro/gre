"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useStudent } from "@/app/contexts/StudentsContext";
import { useClasse } from "@/app/contexts/ClassesContext";
import { useNotes } from "@/app/contexts/NotesContext";
import { ArrowLeft, Printer } from "lucide-react";

export default function RelatorioPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { students } = useStudent();
  const { classes } = useClasse();
  const { notes, isLoading, loadNotes } = useNotes();

  const student = students.find((s) => s.id === id);
  const studentClass = classes.find((c) => c.id === student?.classId);

  useEffect(() => {
    if (id) loadNotes(id);
  }, [id]);

  const today = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  if (!student) {
    return (
      <div className="p-8 text-center text-slate-500">
        <p>Aluno não encontrado.</p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-blue-600 hover:underline text-sm"
        >
          Voltar
        </button>
      </div>
    );
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const formatDate = (date: Date | string) =>
    new Date(date).toLocaleDateString("pt-BR");

  const idade = (() => {
    const birth = new Date(student.birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  })();

  const mesesAtendimento = (() => {
    const start = new Date(student.supportStartDate);
    const now = new Date();
    return (
      (now.getFullYear() - start.getFullYear()) * 12 +
      (now.getMonth() - start.getMonth())
    );
  })();

  return (
    <>
      {/* Barra de ações — não aparece na impressão */}
      <div className="print:hidden flex items-center justify-between p-4 border-b border-slate-200 bg-white sticky top-0 z-10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-800 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
        >
          <Printer className="w-4 h-4" />
          Imprimir / Salvar PDF
        </button>
      </div>

      {/* Documento */}
      <div className="max-w-3xl mx-auto p-8 print:p-0 print:max-w-none">
        <div className="bg-white p-10 print:p-0 rounded-2xl shadow-sm border border-slate-200 print:shadow-none print:border-none space-y-8">
          {/* Cabeçalho */}
          <div className="text-center pb-8 border-b border-slate-200">
            <h1 className="text-2xl font-bold text-slate-800 uppercase tracking-wide">
              Relatório do Aluno
            </h1>
            <p className="text-slate-500 text-sm mt-1">Gerado em {today}</p>
          </div>

          {/* Dados do aluno */}
          <section>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Identificação
            </h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              <DataRow label="Nome" value={student.name} />
              <DataRow label="Idade" value={`${idade} anos`} />
              <DataRow label="Série / Ano" value={student.grade} />
              <DataRow label="Escola" value={student.schoolName} />
              <DataRow label="Turma" value={studentClass?.name ?? "—"} />
              <DataRow label="Responsável" value={student.guardianName} />
              <DataRow label="Telefone" value={student.phone} />
              {student.address && (
                <DataRow label="Endereço" value={student.address} />
              )}
            </div>
          </section>

          {/* Atendimento */}
          <section>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Atendimento
            </h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              <DataRow
                label="Início"
                value={formatDate(student.supportStartDate)}
              />
              <DataRow
                label="Tempo de atendimento"
                value={`${mesesAtendimento} ${
                  mesesAtendimento === 1 ? "mês" : "meses"
                }`}
              />
              <DataRow
                label="Mensalidade"
                value={formatCurrency(student.monthlyPayment)}
              />
              <DataRow
                label="Dia de pagamento"
                value={`Todo dia ${student.paymentDay}`}
              />
            </div>
          </section>

          {/* Informações adicionais */}
          {(student.cognitiveDifficulty || student.healthProfile) && (
            <section>
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                Informações Adicionais
              </h2>
              {student.cognitiveDifficulty && (
                <div className="mb-3">
                  <p className="text-xs font-medium text-slate-500 mb-1">
                    Dificuldade Cognitiva
                  </p>
                  <p className="text-sm text-slate-700">
                    {student.cognitiveDifficulty}
                  </p>
                </div>
              )}
              {student.healthProfile?.allergies &&
                student.healthProfile.allergies.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-medium text-slate-500 mb-1">
                      Alergias
                    </p>
                    <p className="text-sm text-slate-700">
                      {student.healthProfile.allergies.join(", ")}
                    </p>
                  </div>
                )}
              {student.healthProfile?.medications &&
                student.healthProfile.medications.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-1">
                      Medicamentos
                    </p>
                    <p className="text-sm text-slate-700">
                      {student.healthProfile.medications.join(", ")}
                    </p>
                  </div>
                )}
            </section>
          )}

          {/* Anotações / Histórico */}
          <section>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Histórico de Anotações ({notes.length})
            </h2>

            {isLoading ? (
              <p className="text-sm text-slate-400">Carregando anotações...</p>
            ) : notes.length === 0 ? (
              <p className="text-sm text-slate-400 italic">
                Nenhuma anotação registrada.
              </p>
            ) : (
              <div className="space-y-4">
                {notes.map((note, index) => (
                  <div
                    key={note.id}
                    className="border-l-2 border-blue-300 pl-4"
                  >
                    <p className="text-xs text-slate-400 mb-1">
                      {new Date(note.createdAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">
                      {note.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Rodapé */}
          <div className="border-t border-slate-200 pt-6 text-center">
            <p className="text-xs text-slate-400">
              Documento gerado em {today} — Seu GRE
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:p-0,
          .print\\:p-0 * {
            visibility: visible;
          }
          @page {
            margin: 2cm;
          }
        }
      `}</style>
    </>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="text-sm text-slate-800 font-medium">{value}</p>
    </div>
  );
}
