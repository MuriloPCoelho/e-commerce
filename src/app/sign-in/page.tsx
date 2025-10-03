"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export default function SignIn() {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit({ email, password }: FormValues) {
    const { data, error } = await authClient.signIn.email({
      password: password,
      email: email,
      rememberMe: true,
      fetchOptions: {
        onSuccess: () => {
          toast.success("Login realizado com sucesso!");
          router.push("/");
        },
        onError: (error) => {
          console.log(error);
          if (error.error.code === "INVALID_EMAIL_OR_PASSWORD") {
            form.setError("email", {
              type: "manual",
              message: "Email ou senha inválidos.",
            });
            form.setError("password", {
              type: "manual",
              message: "Email ou senha inválidos.",
            });
            toast.error("Email ou senha inválidos.");
          }
        }
      },
    });
  }

  return (
    <div className="h-dvh">
      <div className="flex justify-center flex-col items-center px-12 gap-4 pt-32">
        <h1 className="text-2xl font-bold">Entrar</h1>
        <p className="text-neutral-500">Faça login para continuar</p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite seu email"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <>
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite sua senha"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </>
              )}
            />

            <Button className="mt-4" type="submit">
              Entrar
            </Button>
          </form>
        </Form>

        <div>
          <Link href="/sign-up" className="underline text-sm">
            Não possui uma conta? Crie uma conta
          </Link>
        </div>
      </div>
    </div>
  );
}
