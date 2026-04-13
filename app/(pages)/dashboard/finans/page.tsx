"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
  TrendingUp,
  X,
  Save,
  Pencil,
} from "lucide-react";
import { useMonthlyPayment, StudentPaymentView } from "@/app/contexts/MonthlyPaymentContext";
import { PaymentStatus } from "@/core/types/entities";

// ─── helpers ─────────────────────────────────────────────────────────────────

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function currency(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
}

type ComputedStatus = PaymentStatus | "future";

const STATUS_CONFIG: Record<
  ComputedStatus,
  { label: string; bg: string; text: string; icon: React.ReactNode }
> = {
  paid:    { label: "Pago",     bg: "bg-green-100", text: "text-green-700", icon: <CheckCircle className="w-3.5 h-3.5" /> },
  pending: { label: "Pendente", bg: "bg-amber-100",  text: "text-amber-700",  icon: <Clock className="w-3.5 h-3.5" /> },
  overdue: { label: "Atrasado", bg: "bg-red-100",   text: "text-red-700",   icon: <AlertCircle className="w-3.5 h-3.5" /> },
  future:  { label: "Previsto", bg: "bg-slate-100", text: "text-slate-500", icon: <Clock className="w-3.5 h-3.5" /> },
};

// ─── modal de pagamento ───────────────────────────────────────────────────────

interface PaymentModalProps {
  item: StudentPaymentView;
  onClose: () => void;
}

function PaymentModal({ item, onClose }: PaymentModalProps) {
  const { registerPayment, updatePayment } = useMonthlyPayment();
  const { student, payment, expectedValue } = item;

  const isEdit = !!payment;

  const [paidValue, setPaidValue] = useState(
    String(payment?.paidValue ?? expectedValue)
  );
  const [paidAt, setPaidAt] = useState(
    payment?.paidAt
      ? new Date(payment.paidAt).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0]
  );
  const [notes, setNotes] = useState(payment?.notes ?? "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    const val = parseFloat(paidValue);
    if (isNaN(val) || val <= 0) {
      setError("Informe um valor válido maior que zero.");
      return;
    }
    setIsLoading(true);
    setError("");

    let result: { error?: string };

    if (isEdit && payment) {
      result = await updatePayment(payment.id, {
        paidValue: val,
        paidAt: new Date(paidAt),
        notes: notes || undefined,
        status: "paid",
      });
    } else {
      result = await registerPayment(student, val, new Date(paidAt), notes || undefined);
    }

    setIsLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      onClose();
    }
  };

  const diff = parseFloat(paidValue) - expectedValue;
  const hasDiff = !isNaN(diff) && Math.abs(diff) > 0.01;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-800">
              {isEdit ? "Editar Pagamento" : "Registrar Pagamento"}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">{student.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Info read-only */}
          <div className="flex gap-3">
            <div className="flex-1 bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-500">Mensalidade</p>
              <p className="text-sm font-semibold text-slate-800 mt-0.5">
                {currency(expectedValue)}
              </p>
            </div>
            <div className="flex-1 bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-500">Vencimento</p>
              <p className="text-sm font-semibold text-slate-800 mt-0.5">
                Dia {student.paymentDay}
              </p>
            </div>
          </div>

          {/* Valor pago */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Valor pago <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
                R$
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={paidValue}
                onChange={(e) => { setPaidValue(e.target.value); setError(""); }}
                className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-gray-700 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
            </div>
            {hasDiff && (
              <p className={`text-xs mt-1 font-medium ${diff > 0 ? "text-amber-600" : "text-green-600"}`}>
                {diff > 0
                  ? `+ ${currency(diff)} acima da mensalidade (juros/multa)`
                  : `${currency(Math.abs(diff))} de desconto aplicado`}
              </p>
            )}
          </div>

          {/* Data do pagamento */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Data do pagamento
            </label>
            <input
              type="date"
              value={paidAt}
              onChange={(e) => setPaidAt(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-gray-700 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
          </div>

          {/* Observação */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Observação
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: R$10,00 de juros por atraso, desconto combinado…"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-gray-700 text-sm resize-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 pt-0">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-700 text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isLoading ? "Salvando…" : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── linha da tabela ─────────────────────────────────────────────────────────

function PaymentRow({
  item,
  onRegister,
  onEdit,
}: {
  item: StudentPaymentView;
  onRegister: () => void;
  onEdit: () => void;
}) {
  const { student, payment, computedStatus, dueDate, expectedValue } = item;
  const cfg = STATUS_CONFIG[computedStatus];

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors group">
      {/* Avatar */}
      <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
        <span className="text-xs font-bold text-blue-700">
          {student.name.split(" ").slice(0, 2).map((n) => n[0]).join("")}
        </span>
      </div>

      {/* Nome + série */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 truncate">{student.name}</p>
        <p className="text-xs text-slate-400 truncate">{student.grade}</p>
      </div>

      {/* Vencimento */}
      <div className="hidden sm:block text-center w-20 shrink-0">
        <p className="text-xs text-slate-400">Vencimento</p>
        <p className="text-sm font-medium text-slate-700">
          {dueDate.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
        </p>
      </div>

      {/* Valores */}
      <div className="hidden md:block text-right w-28 shrink-0">
        <p className="text-xs text-slate-400">Esperado</p>
        <p className="text-sm font-medium text-slate-700">{currency(expectedValue)}</p>
        {payment?.paidValue !== undefined && payment.paidValue !== expectedValue && (
          <p className={`text-xs font-semibold ${payment.paidValue > expectedValue ? "text-amber-600" : "text-green-600"}`}>
            Pago: {currency(payment.paidValue)}
          </p>
        )}
      </div>

      {/* Badge status */}
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text} shrink-0`}
      >
        {cfg.icon}
        {cfg.label}
      </span>

      {/* Ações */}
      <div className="flex items-center gap-1 shrink-0">
        {computedStatus === "paid" ? (
          <button
            onClick={onEdit}
            title="Editar pagamento"
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors opacity-0 group-hover:opacity-100"
          >
            <Pencil className="w-4 h-4" />
          </button>
        ) : computedStatus !== "future" ? (
          <button
            onClick={onRegister}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <DollarSign className="w-3.5 h-3.5" />
            Registrar
          </button>
        ) : null}
      </div>
    </div>
  );
}

// ─── página principal ────────────────────────────────────────────────────────

type FilterStatus = "all" | ComputedStatus;

export default function FinancePage() {
  const {
    viewMonth,
    viewYear,
    goToPrevMonth,
    goToNextMonth,
    monthView,
    isLoading,
    overdueCount,
  } = useMonthlyPayment();

  const [filter, setFilter] = useState<FilterStatus>("all");
  const [modalItem, setModalItem] = useState<StudentPaymentView | null>(null);

  // ── stats ────────────────────────────────────────────────────────────────
  const totalEsperado = monthView.reduce((s, v) => s + v.expectedValue, 0);
  const totalRecebido = monthView
    .filter((v) => v.computedStatus === "paid")
    .reduce((s, v) => s + (v.payment?.paidValue ?? v.expectedValue), 0);
  const totalPendente = monthView
    .filter((v) => v.computedStatus === "pending")
    .reduce((s, v) => s + v.expectedValue, 0);
  const totalAtrasado = monthView
    .filter((v) => v.computedStatus === "overdue")
    .reduce((s, v) => s + v.expectedValue, 0);

  const pctRecebido =
    totalEsperado > 0
      ? Math.min(Math.round((totalRecebido / totalEsperado) * 100), 100)
      : 0;

  // ── filtro ───────────────────────────────────────────────────────────────
  const filtered =
    filter === "all" ? monthView : monthView.filter((v) => v.computedStatus === filter);

  const FILTERS: { key: FilterStatus; label: string; count: number }[] = [
    { key: "all",     label: "Todos",     count: monthView.length },
    { key: "paid",    label: "Pagos",     count: monthView.filter((v) => v.computedStatus === "paid").length },
    { key: "pending", label: "Pendentes", count: monthView.filter((v) => v.computedStatus === "pending").length },
    { key: "overdue", label: "Atrasados", count: monthView.filter((v) => v.computedStatus === "overdue").length },
  ];

  return (
    <>
      {/* Modal */}
      {modalItem && (
        <PaymentModal item={modalItem} onClose={() => setModalItem(null)} />
      )}

      <div className="p-6 max-w-5xl mx-auto space-y-6">
        {/* ── Header + navegação de mês ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Financeiro</h2>
            <p className="text-sm text-slate-500">
              Controle de mensalidades por aluno
            </p>
          </div>

          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
            <button
              onClick={goToPrevMonth}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            </button>
            <span className="px-4 text-sm font-semibold text-slate-800 min-w-[140px] text-center">
              {MONTHS[viewMonth - 1]} {viewYear}
            </span>
            <button
              onClick={goToNextMonth}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>

        {/* ── Alerta de atrasados ── */}
        {overdueCount > 0 && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-sm text-red-700 font-medium">
              {overdueCount} {overdueCount === 1 ? "aluno está" : "alunos estão"} com pagamento em atraso este mês.
            </p>
          </div>
        )}

        {/* ── Cards de resumo ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total esperado", value: totalEsperado, color: "text-slate-800", bg: "bg-white", border: "border-slate-200" },
            { label: "Recebido",       value: totalRecebido, color: "text-green-700", bg: "bg-green-50",  border: "border-green-100" },
            { label: "Pendente",       value: totalPendente, color: "text-amber-700", bg: "bg-amber-50",  border: "border-amber-100" },
            { label: "Atrasado",       value: totalAtrasado, color: "text-red-700",   bg: "bg-red-50",    border: "border-red-100"   },
          ].map((card) => (
            <div
              key={card.label}
              className={`${card.bg} border ${card.border} rounded-2xl p-4`}
            >
              <p className="text-xs text-slate-500 font-medium mb-1">{card.label}</p>
              <p className={`text-xl font-bold ${card.color}`}>
                {currency(card.value)}
              </p>
            </div>
          ))}
        </div>

        {/* ── Barra de progresso ── */}
        {totalEsperado > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-semibold text-slate-700">
                  Progresso do mês
                </span>
              </div>
              <span className="text-sm font-bold text-slate-800">
                {pctRecebido}%
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-linear-to-r from-blue-500 to-green-500 transition-all duration-700"
                style={{ width: `${pctRecebido}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-slate-400">
              <span>{currency(totalRecebido)} recebido</span>
              <span>{currency(totalEsperado)} esperado</span>
            </div>
          </div>
        )}

        {/* ── Lista de alunos ── */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          {/* Filtros */}
          <div className="flex items-center gap-1 p-4 border-b border-slate-100 overflow-x-auto">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  filter === f.key
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {f.label}
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    filter === f.key ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {f.count}
                </span>
              </button>
            ))}
          </div>

          {/* Linhas */}
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-slate-400 text-sm">
              Carregando…
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <CheckCircle className="w-10 h-10 text-slate-300 mb-2" />
              <p className="text-sm">Nenhum aluno nesta categoria.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50 px-2 py-2">
              {filtered.map((item) => (
                <PaymentRow
                  key={item.student.id}
                  item={item}
                  onRegister={() => setModalItem(item)}
                  onEdit={() => setModalItem(item)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
