// app/(pages)/students/page.tsx
"use client";

import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Users,
  Calendar,
  School,
  Phone,
} from "lucide-react";
import { useStudent } from "@/app/contexts/StudentsContext";
import Link from "next/link";
import StudentCard from "@/app/components/StudentCard";

export default function StudentsPage() {
  const { students } = useStudent();

  const stats = {
    total: students?.length || 0,
    active:
      students?.filter((s) => new Date(s.supportStartDate) <= new Date())
        .length || 0,
    pending:
      students?.filter((s) => new Date(s.supportStartDate) > new Date())
        .length || 0,
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Meus Estudantes</h1>
          <p className="text-slate-600 mt-1">
            Gerencie todos os seus estudantes e informações
          </p>
        </div>
        <div className="flex gap-3 mt-4 sm:mt-0">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" />
            <span>Filtrar</span>
          </button>
          <Link
            href="/dashboard/student/new-student"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Estudante</span>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">
                Total de Estudantes
              </p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">
                {stats.total}
              </h3>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Ativos</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">
                {stats.active}
              </h3>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Inativos</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">
                {stats.pending}
              </h3>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <School className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar estudantes..."
              className="w-full pl-10 pr-4 py-2 text-gray-700 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            />
          </div>
          <select className="px-4 py-2 border text-gray-700 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition">
            <option value="all">Todos os estudantes</option>
            <option value="active">Em atendimento</option>
            <option value="pending">Pendentes</option>
          </select>
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students?.map((student, index) => (
          <StudentCard key={index} student={student} />
        ))}

        {/* Card para novo estudante */}
        <Link
          href="/dashboard/student/new-student"
          className="border-2 border-dashed border-slate-300 rounded-2xl p-6 hover:border-blue-400 hover:bg-blue-50 transition-all group flex flex-col items-center justify-center min-h-[200px] text-slate-500 hover:text-blue-600"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
            <Plus className="w-6 h-6" />
          </div>
          <span className="font-medium">Adicionar novo estudante</span>
          <p className="text-sm text-center mt-2">
            Cadastre um novo estudante no sistema
          </p>
        </Link>
      </div>

      {/* Empty State */}
      {students?.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-800 mb-2">
            Nenhum estudante cadastrado
          </h3>
          <p className="text-slate-600 mb-6">
            Comece cadastrando seu primeiro estudante.
          </p>
          <Link
            href="/dashboard/students/new-student"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Cadastrar primeiro estudante
          </Link>
        </div>
      )}
    </div>
  );
}
