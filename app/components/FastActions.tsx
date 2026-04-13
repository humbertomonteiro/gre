import { BookOpen, Calendar, FileText, Users } from "lucide-react";
import Link from "next/link";

export default function FastActions() {
  return (
    <div className="my-8 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-xl font-semibold text-slate-800 mb-6">
        Ações Rápidas
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          href="/dashboard/student/new-student"
          className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-center group"
        >
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:bg-blue-200 transition-colors">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <span className="text-sm font-medium text-slate-700">Novo Aluno</span>
        </Link>

        <Link
          href="/dashboard/classes/new-class"
          className="p-4 rounded-xl border border-slate-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200 text-center group"
        >
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:bg-green-200 transition-colors">
            <BookOpen className="w-5 h-5 text-green-600" />
          </div>
          <span className="text-sm font-medium text-slate-700">Nova turma</span>
        </Link>

        <button className="p-4 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 text-center group">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:bg-purple-200 transition-colors">
            <Calendar className="w-5 h-5 text-purple-600" />
          </div>
          <span className="text-sm font-medium text-slate-700">Agendar</span>
        </button>

        <button className="p-4 rounded-xl border border-slate-200 hover:border-yellow-300 hover:bg-yellow-50 transition-all duration-200 text-center group">
          <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:bg-yellow-200 transition-colors">
            <FileText className="w-5 h-5 text-yellow-600" />
          </div>
          <span className="text-sm font-medium text-slate-700">Relatórios</span>
        </button>
      </div>
    </div>
  );
}
