// infra/auth/JWTAuthProvider.ts
import { AuthProvider } from "@/core/application/providers/AuthProvider";
import { compare } from "bcryptjs";

export class JWTAuthProvider implements AuthProvider {
  private readonly SECRET = process.env.JWT_SECRET!;

  async register(email: string, password: string) {
    // const hashedPassword = await bcrypt.hash(password, 10);
    // const user = await prisma.user.create({ data: { email, passwordHash: hashedPassword } });
    return { userId: "user.id" };
  }

  async login(email: string, password: string) {
    // const user = await prisma.user.findUnique({ where: { email } });
    // if (!user || !(await compare(password, user.passwordHash))) {
    //   throw new Error("Credenciais inválidas");
    // }

    // const token = jwt.sign({ sub: user.id, email: user.email }, this.SECRET, {
    //   expiresIn: "7d",
    // });
    return { userId: "user.id", token: "token" };
  }

  async logout() {
    // nada a fazer no JWT puro
  }

  async getCurrentUser() {
    // normalmente isso seria feito via middleware lendo o token JWT
    return null;
  }
}
