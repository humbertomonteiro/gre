// app/(pages)/students/new-student/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  User,
  Calendar,
  School,
  Phone,
  DollarSign,
  MapPin,
} from "lucide-react";
import { useUser } from "@/app/contexts/UserContext";
import { useClasse } from "@/app/contexts/ClassesContext";
import { useStudent } from "@/app/contexts/StudentsContext";
import { makeCreateStudentUseCase } from "@/core/main/factories/student/makeCreateStudentUseCase";
import { GRADES, Grade } from "@/core/types/entities";

export default function NewStudentPage() {
  const router = useRouter();
  const { user } = useUser();
  const { addStudent } = useStudent();
  const { classes } = useClasse();

  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    grade: "" as Grade,
    schoolName: "",
    guardianName: "",
    phone: "",
    classId: "",
    monthlyPayment: "",
    paymentDay: "1",
    supportStartDate: new Date().toISOString().split("T")[0],
    address: "",
    cognitiveDifficulty: "",
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

      if (!formData.classId) {
        setError("Selecione uma turma");
        return;
      }

      // Calcular idade a partir da data de nascimento
      const birthDate = new Date(formData.birthDate);
      //   const today = new Date();
      //   const age = today.getFullYear() - birthDate.getFullYear();

      const createStudentUseCase = makeCreateStudentUseCase();
      const result = await createStudentUseCase.execute({
        id: crypto.randomUUID(),
        userId: user.id,
        classId: formData.classId,
        name: formData.name,
        birthDate: birthDate,
        grade: formData.grade as Grade,
        schoolName: formData.schoolName,
        guardianName: formData.guardianName,
        phone: formData.phone,
        monthlyPayment: Number.parseFloat(formData.monthlyPayment),
        paymentDay: Number.parseInt(formData.paymentDay),
        supportStartDate: new Date(formData.supportStartDate),
        address: formData.address || null,
        cognitiveDifficulty: formData.cognitiveDifficulty || null,
      });

      if (result.error) {
        setError(result.error.message);
        return;
      }

      if (result.value) {
        addStudent(result.value.toDTO());
        router.push("/dashboard/student");
      }
    } catch (err) {
      setError("Erro ao criar estudante. Tente novamente.");
      console.error("Error creating student:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
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
          <h1 className="text-2xl font-bold text-slate-800">Novo Estudante</h1>
          <p className="text-slate-600 mt-1">
            Preencha os dados para cadastrar um novo estudante
          </p>
        </div>
      </div>

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Pessoais */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-6">
              Informações Pessoais
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nome Completo *
                </label>
                <div className="relative">
                  <User className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Nome do estudante"
                    className="w-full pl-10 pr-4 py-3 border text-gray-700 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Data de Nascimento */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Data de Nascimento *
                </label>
                <div className="relative">
                  <Calendar className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => handleChange("birthDate", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border text-gray-700 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Série */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Série/Ano *
                </label>
                <select
                  value={formData.grade}
                  onChange={(e) => handleChange("grade", e.target.value)}
                  className="w-full px-4 py-3 border text-gray-700 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                  required
                  disabled={isLoading}
                >
                  <option value="">Selecione a série</option>
                  {GRADES.map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
              </div>

              {/* Telefone */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Telefone *
                </label>
                <div className="relative">
                  <Phone className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full pl-10 pr-4 py-3 border text-gray-700 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Informações Escolares */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-6">
              Informações Escolares
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nome da Escola */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nome da Escola *
                </label>
                <div className="relative">
                  <School className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.schoolName}
                    onChange={(e) => handleChange("schoolName", e.target.value)}
                    placeholder="Nome da escola"
                    className="w-full pl-10 pr-4 py-3 border text-gray-700 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Responsável */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nome do Responsável *
                </label>
                <div className="relative">
                  <User className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.guardianName}
                    onChange={(e) =>
                      handleChange("guardianName", e.target.value)
                    }
                    placeholder="Nome do responsável"
                    className="w-full pl-10 pr-4 py-3 border text-gray-700 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Endereço */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Endereço
                </label>
                <div className="relative">
                  <MapPin className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="Endereço completo"
                    className="w-full pl-10 pr-4 py-3 border text-gray-700 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Informações do Atendimento */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-6">
              Informações do Atendimento
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Turma */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Turma *
                </label>
                <select
                  value={formData.classId}
                  onChange={(e) => handleChange("classId", e.target.value)}
                  className="w-full px-4 py-3 border text-gray-700 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                  required
                  disabled={isLoading}
                >
                  <option value="">Selecione uma turma</option>
                  {classes?.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mensalidade */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Mensalidade *
                </label>
                <div className="relative">
                  <DollarSign className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="number"
                    step="0.01"
                    value={formData.monthlyPayment}
                    onChange={(e) =>
                      handleChange("monthlyPayment", e.target.value)
                    }
                    placeholder="0,00"
                    className="w-full pl-10 pr-4 py-3 border text-gray-700 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Dia de Pagamento */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Dia de Pagamento *
                </label>
                <select
                  value={formData.paymentDay}
                  onChange={(e) => handleChange("paymentDay", e.target.value)}
                  className="w-full px-4 py-3 border text-gray-700 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                  required
                  disabled={isLoading}
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              {/* Data de Início */}
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Data de Início do Atendimento *
                </label>
                <div className="relative">
                  <Calendar className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="date"
                    value={formData.supportStartDate}
                    onChange={(e) =>
                      handleChange("supportStartDate", e.target.value)
                    }
                    className="w-full pl-10 pr-4 py-3 border text-gray-700 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Dificuldade Cognitiva */}
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Dificuldade Cognitiva (opcional)
                </label>
                <textarea
                  value={formData.cognitiveDifficulty}
                  onChange={(e) =>
                    handleChange("cognitiveDifficulty", e.target.value)
                  }
                  placeholder="Descreva alguma dificuldade cognitiva, se houver"
                  rows={3}
                  className="w-full px-4 py-3 border text-gray-700 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                  disabled={isLoading}
                />
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
              {isLoading ? "Cadastrando..." : "Cadastrar Estudante"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
