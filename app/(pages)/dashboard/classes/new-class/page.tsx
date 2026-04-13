// app/(pages)/classes/new-class/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Clock, Users } from "lucide-react";
import { useUser } from "@/app/contexts/UserContext";
import { useClasse } from "@/app/contexts/ClassesContext";
import { makeCreateClassUseCase } from "@/core/main/factories/class/makeCreateClassUseCase";

export default function NewClassPage() {
  const router = useRouter();
  const { user } = useUser();
  const { addClass } = useClasse();

  const [formData, setFormData] = useState({
    name: "",
    time: "",
    isActive: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!user) {
        setError("Usuário não encontrado");
        return;
      }

      // Criar nova turma
      const createClassUseCase = makeCreateClassUseCase();
      const result = await createClassUseCase.execute({
        id: crypto.randomUUID(),
        userId: user.id,
        name: formData.name,
        time: formData.time,
        isActive: formData.isActive,
      });

      if (result.error) {
        setError(result.error.message);
        return;
      }

      if (result.value) {
        // Redirecionar para a página de turmas
        addClass(result.value.toDTO());
        router.push("/dashboard/classes");
      }
    } catch (err) {
      setError("Erro ao criar turma. Tente novamente.");
      console.error("Error creating class:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg text-gray-700 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Nova Turma</h1>
          <p className="text-slate-600 mt-1">
            Preencha os dados para criar uma nova turma
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card do formulário */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-6">
              Informações da Turma
            </h2>

            <div className="space-y-6">
              {/* Nome da turma */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nome da Turma *
                </label>
                <div className="relative">
                  <Users className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Ex: Matemática Básica, Português Intermediário"
                    className="w-full pl-10 pr-4 py-3 border text-gray-700 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Horário */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Horário da Aula *
                </label>
                <div className="relative">
                  <Clock className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) => handleChange("time", e.target.value)}
                    placeholder="Ex: 14:00 - 15:30, Segunda e Quarta 09:00"
                    className="w-full pl-10 pr-4 py-3 border text-gray-700 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                    required
                    disabled={isLoading}
                  />
                </div>
                <p className="text-sm text-slate-500 mt-2">
                  Descreva o horário de forma clara para os alunos
                </p>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Status da Turma
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      checked={formData.isActive}
                      onChange={() => handleChange("isActive", true)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-400"
                      disabled={isLoading}
                    />
                    <span className="ml-2 text-slate-700">Ativa</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      checked={!formData.isActive}
                      onChange={() => handleChange("isActive", false)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-400"
                      disabled={isLoading}
                    />
                    <span className="ml-2 text-slate-700">Inativa</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Erro */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Ações */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={isLoading}
              className="px-6 py-3 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isLoading ? "Criando..." : "Criar Turma"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
