"use client";
import Link from "next/link";
import { useStudent } from "../contexts/StudentsContext";
import { Cake } from "lucide-react";

export default function UpcomingBirthdays() {
  const { upcomingBirthdays } = useStudent();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-800">
          Próximos Aniversários
        </h2>
        <Link
          href="/dashboard/student/birthdays"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Ver calendário
        </Link>
      </div>

      <div className="space-y-4">
        {upcomingBirthdays.length < 1 ? (
          <div className="text-gray-600">Sem aniversáriantes nesse mês.</div>
        ) : (
          upcomingBirthdays.map((b) => (
            <div
              key={b.id}
              className="flex items-center justify-between p-4 rounded-lg border border-slate-100 hover:border-blue-200 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                  <Cake className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-800">{b.name}</h3>
                  <p className="text-sm text-slate-600">
                    Vai fazer <strong>{b.ageTurning}</strong> anos
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-medium text-slate-800">
                  {b.nextBirthday.toLocaleDateString("pt-BR")}
                </p>
                <p className="text-sm text-slate-500">
                  {b.nextBirthday.toLocaleDateString("pt-BR", {
                    weekday: "long",
                  })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
