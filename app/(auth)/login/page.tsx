"use client";
import { FormEvent, useState } from "react";
import { makeLoginUserUseCase } from "../../../core/main/factories/auth/makeLoginUserUseCase";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/contexts/UserContext";

export default function Login() {
  const router = useRouter();
  const { login } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const loginUser = makeLoginUserUseCase();
      const result = await loginUser.execute({ email, password });

      if (result.error) {
        setError(result.error.message);
        return;
      }

      if (result.value) {
        // Armazenar no contexto
        login(result.value.user, result.value.token);

        console.log("Usuário autenticado:", result.value.user);
        router.push("/dashboard");
      }
    } catch (error) {
      setError("Erro ao fazer login. Tente novamente.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen from-blue-50 to-blue-100 p-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 animate-fadeIn">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Fazer Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
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
            type="submit"
            className="w-full py-2 rounded-lg text-white font-medium transition-all bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl"
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {/* Link para cadastro */}
        <p className="text-sm text-gray-600 text-center mt-4">
          Ainda não tem conta?{" "}
          <span
            onClick={() => router.push("/register")}
            className="text-blue-600 font-medium cursor-pointer hover:underline"
          >
            Criar Conta
          </span>
        </p>
      </div>
    </div>
  );
}
