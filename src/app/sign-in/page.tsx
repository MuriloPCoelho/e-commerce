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
        },
      },
    });
  }

  async function handleSignInWithGoogle() {
    await authClient.signIn.social({
      provider: "google",
      fetchOptions: {
        onSuccess: () => {
          router.push("/")
        }
      }
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

            <div className="flex flex-col w-full gap-2 items-center">
              <Button className="mt-4 w-full" type="submit">
                Entrar
              </Button>
              <span>ou</span>
              <Button className="w-full" variant="outline" type="button" onClick={handleSignInWithGoogle}>
                <svg
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                >
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                  ></path>
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                  ></path>
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                  ></path>
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  ></path>
                  <path fill="none" d="M0 0h48v48H0z"></path>
                </svg>
                <span className="leading-none">Entrar com Google</span>
              </Button>
            </div>
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
