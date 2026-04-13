"use client";

import { useStudent } from "@/app/contexts/StudentsContext";
// Nome dos meses em PT-BR
const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export default function BirthdaysCalendar() {
  const { students } = useStudent();

  const birthdaysByMonth = MONTHS.map((month, monthIndex) => {
    // filtra alunos cujo aniversário é neste mês
    const birthdays = students
      .filter((s) => new Date(s.birthDate).getMonth() === monthIndex)
      .map((s) => ({
        id: s.id,
        name: s.name,
        day: new Date(s.birthDate).getDate(),
        birthDate: new Date(s.birthDate),
      }))
      .sort((a, b) => a.day - b.day);

    return { month, birthdays };
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-slate-800 mb-6">
        Calendário Anual de Aniversários
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {birthdaysByMonth.map(({ month, birthdays }, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5"
          >
            <h3 className="text-lg font-bold text-slate-800 mb-4">{month}</h3>

            {birthdays.length === 0 && (
              <p className="text-sm text-slate-500 italic">
                Nenhum aniversário este mês.
              </p>
            )}

            <div className="space-y-3">
              {birthdays.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-blue-200 transition-colors"
                >
                  <div>
                    <p className="font-medium text-slate-800">{b.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-blue-600">
                      {b.day} / {index + 1}
                    </p>
                    <p className="text-xs text-slate-500">
                      {b.birthDate.getFullYear()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
