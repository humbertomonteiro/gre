"use client";

import { Plus, Search, Filter, Users, Clock, Calendar } from "lucide-react";
import { useClasse } from "@/app/contexts/ClassesContext";
import Link from "next/link";
import ClassCard from "@/app/components/ClassCard";
import { useState, useMemo } from "react";

export default function ClassesPage() {
  const { classes } = useClasse();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filtro combinado
  const filteredClasses = useMemo(() => {
    return classes?.filter((classItem) => {
      const matchesSearch = classItem.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && classItem.isActive) ||
        (statusFilter === "inactive" && !classItem.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [classes, searchTerm, statusFilter]);

  const stats = {
    total: classes?.length,
    active: classes?.filter((c) => c.isActive).length,
    inactive: classes?.filter((c) => !c.isActive).length,
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Minhas Turmas</h1>
          <p className="text-slate-600 mt-1">
            Gerencie todas as suas turmas e horários
          </p>
        </div>
        <div className="flex gap-3 mt-4 sm:mt-0">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" />
            <span>Filtrar</span>
          </button>
          <Link
            href="/dashboard/classes/new-class"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Turma</span>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">
                Total de Turmas
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
              <p className="text-sm font-medium text-slate-600">
                Turmas Ativas
              </p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">
                {stats.active}
              </h3>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">
                Turmas Inativas
              </p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">
                {stats.inactive}
              </h3>
            </div>
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-slate-600" />
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
              placeholder="Buscar turmas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-gray-700 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border text-gray-700 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
          >
            <option value="all">Todas as turmas</option>
            <option value="active">Ativas</option>
            <option value="inactive">Inativas</option>
          </select>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses?.map((classItem, index) => (
          <ClassCard key={classItem.id} index={index} classItem={classItem} />
        ))}

        {/* Card para nova turma */}
        <Link
          href="/dashboard/classes/new-class"
          className="border-2 border-dashed border-slate-300 rounded-2xl p-6 hover:border-blue-400 hover:bg-blue-50 transition-all group flex flex-col items-center justify-center min-h-[200px] text-slate-500 hover:text-blue-600"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
            <Plus className="w-6 h-6" />
          </div>
          <span className="font-medium">Adicionar nova turma</span>
          <p className="text-sm text-center mt-2">
            Crie uma nova turma e organize seus horários
          </p>
        </Link>
      </div>

      {/* Empty State */}
      {filteredClasses?.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-800 mb-2">
            {searchTerm || statusFilter !== "all"
              ? "Nenhuma turma encontrada"
              : "Nenhuma turma criada"}
          </h3>
          <p className="text-slate-600 mb-6">
            {searchTerm || statusFilter !== "all"
              ? "Tente ajustar os filtros de busca."
              : "Comece criando sua primeira turma para organizar seus alunos."}
          </p>
          <Link
            href="/dashboard/classes/new-class"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Criar primeira turma
          </Link>
        </div>
      )}
    </div>
  );
}
