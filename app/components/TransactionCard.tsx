import { TransactionProps } from "@/core/types/entities";
import { ArrowDown, ArrowUp, Clock, CheckCircle } from "lucide-react";

export default function TransactionCard({
  transaction,
}: {
  transaction: TransactionProps;
}) {
  const isIncome = transaction.type === "income";
  const isPaid = transaction.status === "paid";

  const formattedValue = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(transaction.value);

  const formattedDate = transaction.date
    ? new Date(transaction.date).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        {/* Ícone */}
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
            isIncome ? "bg-green-100" : "bg-red-100"
          }`}
        >
          {isIncome ? (
            <ArrowUp className="w-5 h-5 text-green-600" />
          ) : (
            <ArrowDown className="w-5 h-5 text-red-600" />
          )}
        </div>

        {/* Conteúdo */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-slate-700 truncate">
              {transaction.description ?? (isIncome ? "Receita" : "Despesa")}
            </p>
            <span
              className={`text-base font-bold shrink-0 ${
                isIncome ? "text-green-600" : "text-red-600"
              }`}
            >
              {isIncome ? "+" : "-"} {formattedValue}
            </span>
          </div>

          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-slate-400">{formattedDate}</p>
            <span
              className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                isPaid
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {isPaid ? (
                <CheckCircle className="w-3 h-3" />
              ) : (
                <Clock className="w-3 h-3" />
              )}
              {isPaid ? "Pago" : "Pendente"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
