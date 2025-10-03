import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function SignUp() {
  return (
    <div className="h-dvh flex flex-col">
      <div className="flex justify-center flex-col items-center px-10 gap-4 pt-32">
        <h1 className="text-2xl font-bold">Criar conta</h1>
        <p>Por favor, preencha os dados para criar sua conta.</p>
        <Input placeholder="Nome" />
        <Input placeholder="Email" />
        <Input placeholder="Senha" type="password" />
        <Input placeholder="Confirme a Senha" type="password" />
        <Button>Criar conta</Button>
        <div>
          <Link href="/sign-in" className="underline text-sm">
            Já possui uma conta? Entre
          </Link>
        </div>
      </div>
    </div>
  );
}
