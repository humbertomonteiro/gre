"use client";

import { FormEvent, useState } from "react";
import { makeCreateUserUseCase } from "../../../core/main/factories/auth/makeCreateUserUseCase";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const createUser = makeCreateUserUseCase();

    const result = await createUser.execute({
      name,
      email,
      password,
    });

    setLoading(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    router.push("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen from-blue-50 to-blue-100 p-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 animate-fadeIn">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Criar Conta
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              required
            />
          </div>

          {/* Senha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              required
            />
          </div>

          {/* Erro */}
          {error && (
            <p className="text-red-600 text-sm text-center bg-red-50 p-2 rounded-lg border border-red-200">
              {error}
            </p>
          )}

          {/* Botão */}
          <button
            disabled={loading}
            type="submit"
            className={`w-full py-2 rounded-lg text-white font-medium transition-all 
            ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl"
            }`}
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        {/* Link para login */}
        <p className="text-sm text-gray-600 text-center mt-4">
          Já tem conta?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-blue-600 font-medium cursor-pointer hover:underline"
          >
            Fazer Login
          </span>
        </p>
      </div>
    </div>
  );
}
