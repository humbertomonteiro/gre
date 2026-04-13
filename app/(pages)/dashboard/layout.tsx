"use client";

import { ReactNode, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Users,
  BookOpen,
  LayoutDashboard,
  Wallet,
  Menu,
  X,
  Bell,
  LogOut,
  GraduationCap,
  ChevronRight,
  AlertCircle,
  Clock,
} from "lucide-react";
import { useUser } from "@/app/contexts/UserContext";
import { useMonthlyPayment } from "@/app/contexts/MonthlyPaymentContext";

// ─── navegação ────────────────────────────────────────────────────────────────

const navigation = [
  { name: "Visão Geral", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { name: "Alunos",      href: "/dashboard/student", icon: Users,          exact: false },
  { name: "Turmas",      href: "/dashboard/classes", icon: BookOpen,       exact: false },
  { name: "Financeiro",  href: "/dashboard/finans",  icon: Wallet,         exact: false },
];

function isActive(pathname: string, href: string, exact: boolean) {
  return exact ? pathname === href : pathname.startsWith(href);
}

function NavItem({
  item,
  pathname,
  onClick,
}: {
  item: (typeof navigation)[number];
  pathname: string;
  onClick?: () => void;
}) {
  const active = isActive(pathname, item.href, item.exact);
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
        active
          ? "bg-blue-600 text-white shadow-sm"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      <Icon
        className={`w-4 h-4 shrink-0 ${
          active ? "text-white" : "text-slate-400 group-hover:text-slate-600"
        }`}
      />
      <span className="flex-1">{item.name}</span>
      {active && <ChevronRight className="w-3.5 h-3.5 text-blue-200" />}
    </Link>
  );
}

// ─── painel de notificações ───────────────────────────────────────────────────

function NotificationPanel({ onClose }: { onClose: () => void }) {
  const { overdueItems, pendingTodayItems } = useMonthlyPayment();

  const total = overdueItems.length + pendingTodayItems.length;

  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-slate-600" />
          <span className="text-sm font-semibold text-slate-800">
            Notificações
          </span>
          {total > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {total}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {total === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-slate-400">
            <Bell className="w-8 h-8 text-slate-200 mb-2" />
            <p className="text-sm">Nenhuma notificação</p>
          </div>
        ) : (
          <div>
            {/* Atrasados */}
            {overdueItems.length > 0 && (
              <div>
                <p className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50">
                  Pagamentos em atraso
                </p>
                {overdueItems.map((item) => (
                  <Link
                    key={item.student.id}
                    href="/dashboard/finans"
                    onClick={onClose}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-red-50 transition-colors border-b border-slate-50"
                  >
                    <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                      <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">
                        {item.student.name}
                      </p>
                      <p className="text-xs text-red-600 mt-0.5">
                        Venceu dia {item.student.paymentDay} —{" "}
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(item.expectedValue)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Vencem hoje */}
            {pendingTodayItems.length > 0 && (
              <div>
                <p className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50">
                  Vencem hoje
                </p>
                {pendingTodayItems.map((item) => (
                  <Link
                    key={item.student.id}
                    href="/dashboard/finans"
                    onClick={onClose}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-amber-50 transition-colors border-b border-slate-50"
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">
                        {item.student.name}
                      </p>
                      <p className="text-xs text-amber-600 mt-0.5">
                        Vence hoje —{" "}
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(item.expectedValue)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {total > 0 && (
        <div className="border-t border-slate-100 px-4 py-3">
          <Link
            href="/dashboard/finans"
            onClick={onClose}
            className="block text-center text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            Ver financeiro completo →
          </Link>
        </div>
      )}
    </div>
  );
}

// ─── layout ───────────────────────────────────────────────────────────────────

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useUser();
  const { overdueCount, pendingTodayItems } = useMonthlyPayment();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const notifTotal = overdueCount + pendingTodayItems.length;

  // Fecha o painel ao clicar fora
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const initials = user?.name
    ? user.name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()
    : "?";

  const currentPage =
    navigation.find((n) => isActive(pathname, n.href, n.exact))?.name ??
    "Dashboard";

  const SidebarUser = () => (
    <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-slate-50 transition-colors">
      <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shrink-0">
        <span className="text-xs font-bold text-white">{initials}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 truncate">{user?.name}</p>
        <p className="text-xs text-slate-400 truncate">{user?.email}</p>
      </div>
      <button
        onClick={handleLogout}
        title="Sair"
        className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
      >
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* ── Sidebar desktop ── */}
      <aside className="hidden lg:flex w-60 flex-col bg-white border-r border-slate-200 shrink-0">
        <div className="flex items-center gap-2.5 h-16 px-5 border-b border-slate-100 shrink-0">
          <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 leading-none">Formando</p>
            <p className="text-xs text-blue-600 font-semibold leading-none mt-0.5">Futuros</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-3 mb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
            Menu
          </p>
          {navigation.map((item) => (
            <NavItem key={item.href} item={item} pathname={pathname} />
          ))}
        </nav>

        <div className="shrink-0 border-t border-slate-100 p-3">
          <SidebarUser />
        </div>
      </aside>

      {/* ── Sidebar mobile ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-64 bg-white flex flex-col shadow-xl">
            <div className="flex items-center justify-between h-16 px-5 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 leading-none">Formando</p>
                  <p className="text-xs text-blue-600 font-semibold leading-none mt-0.5">Futuros</p>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {navigation.map((item) => (
                <NavItem
                  key={item.href}
                  item={item}
                  pathname={pathname}
                  onClick={() => setSidebarOpen(false)}
                />
              ))}
            </nav>

            <div className="shrink-0 border-t border-slate-100 p-3">
              <SidebarUser />
            </div>
          </aside>
        </div>
      )}

      {/* ── Main ── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between h-16 px-5 bg-white border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
            >
              <Menu className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-base font-semibold text-slate-800">{currentPage}</h1>
              <p className="text-xs text-slate-400 hidden sm:block">
                {new Date().toLocaleDateString("pt-BR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Bell com dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen((o) => !o)}
                className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Bell className="w-5 h-5 text-slate-500" />
                {notifTotal > 0 && (
                  <span className="absolute top-1 right-1 min-w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 border-2 border-white">
                    {notifTotal > 9 ? "9+" : notifTotal}
                  </span>
                )}
              </button>

              {notifOpen && (
                <NotificationPanel onClose={() => setNotifOpen(false)} />
              )}
            </div>

            <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">{initials}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
