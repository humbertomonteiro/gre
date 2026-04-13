"use client";

import { useParams, useRouter } from "next/navigation";
import { useStudent } from "@/app/contexts/StudentsContext";
import { useClasse } from "@/app/contexts/ClassesContext";
import { ArrowLeft, Printer } from "lucide-react";

export default function ContratoPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { students } = useStudent();
  const { classes } = useClasse();

  const student = students.find((s) => s.id === id);
  const studentClass = classes.find((c) => c.id === student?.classId);

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
        <div className="bg-white p-10 print:p-0 rounded-2xl shadow-sm border border-slate-200 print:shadow-none print:border-none">
          {/* Cabeçalho */}
          <div className="text-center mb-10 pb-8 border-b border-slate-200">
            <h1 className="text-2xl font-bold text-slate-800 uppercase tracking-wide">
              Contrato de Prestação de Serviços
            </h1>
            <p className="text-slate-500 text-sm mt-1">Reforço Escolar</p>
          </div>

          {/* Qualificação das partes */}
          <section className="mb-8">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Das Partes
            </h2>

            <p className="text-slate-700 leading-relaxed mb-4">
              <strong>CONTRATANTE:</strong> {student.guardianName}, responsável
              pelo(a) menor <strong>{student.name}</strong>, aluno(a) do(a){" "}
              <strong>{student.grade}</strong> da escola{" "}
              <strong>{student.schoolName}</strong>.
            </p>

            <p className="text-slate-700 leading-relaxed">
              <strong>CONTRATADO(A):</strong> Profissional de Reforço Escolar,
              doravante denominado(a) simplesmente <strong>CONTRATADO(A)</strong>
              .
            </p>
          </section>

          {/* Objeto do contrato */}
          <section className="mb-8">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Do Objeto
            </h2>
            <p className="text-slate-700 leading-relaxed">
              O presente contrato tem por objeto a prestação de serviços de
              reforço escolar para o(a) aluno(a) <strong>{student.name}</strong>
              {studentClass ? (
                <>
                  , integrante da turma <strong>{studentClass.name}</strong>
                </>
              ) : null}
              , com início em <strong>{formatDate(student.supportStartDate)}</strong>
              .
            </p>
          </section>

          {/* Remuneração */}
          <section className="mb-8">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Da Remuneração
            </h2>
            <p className="text-slate-700 leading-relaxed">
              Pelo serviço ora contratado, o(a) CONTRATANTE pagará ao(à)
              CONTRATADO(A) o valor mensal de{" "}
              <strong>{formatCurrency(student.monthlyPayment)}</strong>, a ser
              quitado todo dia <strong>{student.paymentDay}</strong> de cada mês,
              por meio a ser acordado entre as partes.
            </p>
            <p className="text-slate-700 leading-relaxed mt-3">
              Em caso de atraso no pagamento, o(a) CONTRATANTE estará sujeito(a)
              a multa de 2% e juros de 1% ao mês sobre o valor devido.
            </p>
          </section>

          {/* Obrigações */}
          <section className="mb-8">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Das Obrigações
            </h2>

            <p className="font-medium text-slate-700 mb-2">
              São obrigações do(a) CONTRATADO(A):
            </p>
            <ul className="list-disc list-inside text-slate-700 space-y-1 mb-4 ml-2">
              <li>Comparecer pontualmente às aulas agendadas;</li>
              <li>Elaborar e aplicar atividades pedagógicas adequadas;</li>
              <li>
                Comunicar ao(à) CONTRATANTE o progresso do(a) aluno(a);
              </li>
              <li>Manter sigilo sobre as informações do(a) aluno(a).</li>
            </ul>

            <p className="font-medium text-slate-700 mb-2">
              São obrigações do(a) CONTRATANTE:
            </p>
            <ul className="list-disc list-inside text-slate-700 space-y-1 ml-2">
              <li>Realizar os pagamentos nas datas acordadas;</li>
              <li>
                Comunicar com antecedência mínima de 24h qualquer cancelamento;
              </li>
              <li>
                Garantir que o(a) aluno(a) esteja disponível nos horários
                agendados.
              </li>
            </ul>
          </section>

          {/* Rescisão */}
          <section className="mb-8">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Da Rescisão
            </h2>
            <p className="text-slate-700 leading-relaxed">
              Este contrato poderá ser rescindido por qualquer das partes
              mediante aviso prévio de <strong>15 (quinze) dias</strong>. Em
              caso de rescisão por inadimplência do(a) CONTRATANTE, não haverá
              devolução de valores já pagos.
            </p>
          </section>

          {/* Foro */}
          <section className="mb-10">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Do Foro
            </h2>
            <p className="text-slate-700 leading-relaxed">
              As partes elegem o foro da comarca de sua cidade para dirimir
              quaisquer questões oriundas deste contrato, renunciando a qualquer
              outro, por mais privilegiado que seja.
            </p>
          </section>

          {/* Data e assinaturas */}
          <div className="border-t border-slate-200 pt-8 mt-8">
            <p className="text-center text-slate-600 mb-12">
              Assinado em {today}.
            </p>

            <div className="grid grid-cols-2 gap-16">
              <div className="text-center">
                <div className="border-b border-slate-400 mb-2 h-12" />
                <p className="text-sm font-medium text-slate-700">
                  {student.guardianName}
                </p>
                <p className="text-xs text-slate-500">CONTRATANTE</p>
              </div>
              <div className="text-center">
                <div className="border-b border-slate-400 mb-2 h-12" />
                <p className="text-sm font-medium text-slate-700">
                  Profissional de Reforço Escolar
                </p>
                <p className="text-xs text-slate-500">CONTRATADO(A)</p>
              </div>
            </div>
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
