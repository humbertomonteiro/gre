"use client";

import Link from "next/link";
import {
  Users,
  BookOpen,
  TrendingUp,
  Wallet,
  AlertCircle,
  Plus,
  ArrowRight,
  Cake,
  CalendarClock,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useUser } from "@/app/contexts/UserContext";
import { useStudent } from "@/app/contexts/StudentsContext";
import { useClasse } from "@/app/contexts/ClassesContext";
import { useTransactions } from "@/app/contexts/TransactionContext";

// ─── helpers ────────────────────────────────────────────────────────────────

function currency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function sameMonth(date: Date, ref: Date) {
  return (
    date.getMonth() === ref.getMonth() &&
    date.getFullYear() === ref.getFullYear()
  );
}

// ─── sub-components ─────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  sub,
  color,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  color: "blue" | "green" | "amber" | "rose";
  href?: string;
}) {
  const palette = {
    blue:  { bg: "bg-blue-50",  ring: "ring-blue-100",  icon: "bg-blue-600",  text: "text-blue-700" },
    green: { bg: "bg-green-50", ring: "ring-green-100", icon: "bg-green-600", text: "text-green-700" },
    amber: { bg: "bg-amber-50", ring: "ring-amber-100", icon: "bg-amber-500", text: "text-amber-700" },
    rose:  { bg: "bg-rose-50",  ring: "ring-rose-100",  icon: "bg-rose-600",  text: "text-rose-700" },
  }[color];

  const inner = (
    <div
      className={`${palette.bg} rounded-2xl p-5 ring-1 ${palette.ring} hover:shadow-md transition-shadow h-full flex flex-col justify-between`}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-10 h-10 ${palette.icon} rounded-xl flex items-center justify-center text-white`}
        >
          {icon}
        </div>
        {href && (
          <ArrowRight className={`w-4 h-4 ${palette.text} opacity-40 group-hover:opacity-100 transition-opacity`} />
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        {sub && <p className={`text-xs font-medium mt-1 ${palette.text}`}>{sub}</p>}
      </div>
    </div>
  );

  if (href)
    return (
      <Link href={href} className="group block h-full">
        {inner}
      </Link>
    );

  return inner;
}

// ─── page ────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user } = useUser();
  const { students, upcomingBirthdays } = useStudent();
  const { classes } = useClasse();
  const { transactions } = useTransactions();

  const now = new Date();
  const today = now.getDate();

  // ── Financial stats ──────────────────────────────────────────────────────
  const thisMonth = transactions.filter((t) => {
    const d = t.date instanceof Date ? t.date : new Date(t.date);
    return sameMonth(d, now);
  });

  const recebidoMes = thisMonth
    .filter((t) => t.type === "income" && t.status === "paid")
    .reduce((s, t) => s + t.value, 0);

  const aReceberMes = thisMonth
    .filter((t) => t.type === "income" && t.status === "pending")
    .reduce((s, t) => s + t.value, 0);

  // ── Students with payment in next 7 days ────────────────────────────────
  const pagamentosProximos = students
    .filter((s) => {
      const diff = s.paymentDay - today;
      return diff >= 0 && diff <= 7;
    })
    .sort((a, b) => a.paymentDay - b.paymentDay);

  // ── Mensalidade ideal (soma de todos os alunos ativos) ──────────────────
  const mensalidadeIdeal = students.reduce((s, st) => s + st.monthlyPayment, 0);

  // ── Greeting ─────────────────────────────────────────────────────────────
  const hour = now.getHours();
  const greeting =
    hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  const firstName = user?.name?.split(" ")[0] ?? "";

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {greeting}, {firstName}!
          </h2>
          <p className="text-slate-500 text-sm mt-0.5">
            Aqui está o resumo de hoje do seu reforço escolar.
          </p>
        </div>
        <Link
          href="/dashboard/student/new-student"
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Novo Aluno
        </Link>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Users className="w-5 h-5" />}
          label="Total de Alunos"
          value={String(students.length)}
          sub={students.length === 0 ? "Nenhum cadastrado" : `${students.length} ${students.length === 1 ? "aluno" : "alunos"} ativos`}
          color="blue"
          href="/dashboard/student"
        />
        <StatCard
          icon={<BookOpen className="w-5 h-5" />}
          label="Turmas"
          value={String(classes.length)}
          sub={classes.length === 0 ? "Nenhuma criada" : `${classes.length} ${classes.length === 1 ? "turma" : "turmas"}`}
          color="green"
          href="/dashboard/classes"
        />
        <StatCard
          icon={<Wallet className="w-5 h-5" />}
          label="Recebido no mês"
          value={currency(recebidoMes)}
          sub={`Meta: ${currency(mensalidadeIdeal)}`}
          color="green"
          href="/dashboard/finans"
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="A receber"
          value={currency(aReceberMes)}
          sub={aReceberMes > 0 ? "Pagamentos pendentes" : "Em dia!"}
          color={aReceberMes > 0 ? "amber" : "green"}
          href="/dashboard/finans"
        />
      </div>

      {/* ── Progress bar: recebido vs meta ── */}
      {mensalidadeIdeal > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-semibold text-slate-700">
                Recebimentos do mês
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {currency(recebidoMes)} de {currency(mensalidadeIdeal)} esperado
              </p>
            </div>
            <span className="text-sm font-bold text-slate-700">
              {Math.min(Math.round((recebidoMes / mensalidadeIdeal) * 100), 100)}%
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-700"
              style={{
                width: `${Math.min((recebidoMes / mensalidadeIdeal) * 100, 100)}%`,
              }}
            />
          </div>
          {aReceberMes > 0 && (
            <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {currency(aReceberMes)} ainda pendente este mês
            </p>
          )}
        </div>
      )}

      {/* ── Two-column grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Pagamentos próximos ── */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <CalendarClock className="w-4.5 h-4.5 text-amber-500" />
              <h3 className="text-sm font-semibold text-slate-800">
                Pagamentos próximos
              </h3>
            </div>
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
              próximos 7 dias
            </span>
          </div>

          {pagamentosProximos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-slate-400">
              <CheckCircle className="w-8 h-8 mb-2 text-green-400" />
              <p className="text-sm">Nenhum pagamento nos próximos 7 dias</p>
            </div>
          ) : (
            <div className="space-y-2">
              {pagamentosProximos.map((s) => {
                const daysLeft = s.paymentDay - today;
                return (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-blue-700">
                          {s.paymentDay}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          {s.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {daysLeft === 0
                            ? "Vence hoje"
                            : `${daysLeft} ${daysLeft === 1 ? "dia" : "dias"}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-800">
                        {currency(s.monthlyPayment)}
                      </p>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                          daysLeft === 0
                            ? "bg-red-100 text-red-600"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {daysLeft === 0 ? "Hoje" : `dia ${s.paymentDay}`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Aniversários próximos ── */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Cake className="w-4.5 h-4.5 text-pink-500" />
              <h3 className="text-sm font-semibold text-slate-800">
                Aniversários do mês
              </h3>
            </div>
            <Link
              href="/dashboard/student/birthdays"
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Ver todos
            </Link>
          </div>

          {upcomingBirthdays.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-slate-400">
              <Cake className="w-8 h-8 mb-2 text-slate-300" />
              <p className="text-sm">Nenhum aniversário este mês</p>
            </div>
          ) : (
            <div className="space-y-2">
              {upcomingBirthdays.slice(0, 5).map((b) => {
                const isToday =
                  b.nextBirthday.getDate() === today &&
                  b.nextBirthday.getMonth() === now.getMonth();
                return (
                  <div
                    key={b.id}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isToday ? "bg-pink-500" : "bg-pink-100"
                        }`}
                      >
                        <Cake
                          className={`w-4 h-4 ${isToday ? "text-white" : "text-pink-500"}`}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          {b.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {b.ageTurning} anos
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-slate-700">
                        {b.nextBirthday.toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </p>
                      {isToday && (
                        <span className="text-xs bg-pink-100 text-pink-600 px-1.5 py-0.5 rounded-full font-medium">
                          Hoje!
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Ações rápidas ── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">
          Ações rápidas
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              href: "/dashboard/student/new-student",
              label: "Novo Aluno",
              icon: <Users className="w-5 h-5 text-blue-600" />,
              bg: "bg-blue-50 hover:bg-blue-100",
            },
            {
              href: "/dashboard/classes/new-class",
              label: "Nova Turma",
              icon: <BookOpen className="w-5 h-5 text-green-600" />,
              bg: "bg-green-50 hover:bg-green-100",
            },
            {
              href: "/dashboard/finans",
              label: "Financeiro",
              icon: <Wallet className="w-5 h-5 text-amber-600" />,
              bg: "bg-amber-50 hover:bg-amber-100",
            },
            {
              href: "/dashboard/student/birthdays",
              label: "Aniversários",
              icon: <Cake className="w-5 h-5 text-pink-500" />,
              bg: "bg-pink-50 hover:bg-pink-100",
            },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`${action.bg} rounded-xl p-4 flex flex-col items-center gap-2 transition-colors group`}
            >
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow transition-shadow">
                {action.icon}
              </div>
              <span className="text-xs font-medium text-slate-700 text-center">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Últimas transações ── */}
      {transactions.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-slate-800">
              Últimas transações
            </h3>
            <Link
              href="/dashboard/finans"
              className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              Ver todas <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {transactions.slice(0, 5).map((t) => {
              const isIncome = t.type === "income";
              const isPaid = t.status === "paid";
              const d = t.date instanceof Date ? t.date : new Date(t.date);
              return (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isIncome ? "bg-green-100" : "bg-red-100"
                      }`}
                    >
                      <Wallet
                        className={`w-4 h-4 ${
                          isIncome ? "text-green-600" : "text-red-600"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {t.description ?? (isIncome ? "Receita" : "Despesa")}
                      </p>
                      <p className="text-xs text-slate-400">
                        {d.toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm font-semibold ${
                        isIncome ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isIncome ? "+" : "-"} {currency(t.value)}
                    </span>
                    <span
                      className={`hidden sm:flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                        isPaid
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
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
              );
            })}
          </div>
        </div>
      )}

      {/* ── Empty state (sem dados) ── */}
      {students.length === 0 && classes.length === 0 && transactions.length === 0 && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-8 text-center">
          <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-7 h-7 text-blue-600" />
          </div>
          <h3 className="text-base font-semibold text-slate-800 mb-1">
            Bem-vindo ao Formando Futuros!
          </h3>
          <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
            Comece cadastrando sua primeira turma e seus alunos para ver o
            dashboard tomar vida.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/dashboard/classes/new-class"
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 text-sm font-medium"
            >
              <BookOpen className="w-4 h-4" />
              Criar primeira turma
            </Link>
            <Link
              href="/dashboard/student/new-student"
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm font-medium"
            >
              <Users className="w-4 h-4" />
              Cadastrar primeiro aluno
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// Needed for the empty state icon import
function GraduationCap({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}
