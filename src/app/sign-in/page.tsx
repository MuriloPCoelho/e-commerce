"use client";

import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
// import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { use } from "react";

const formSchema = z.object({
  email: z.email("Email inválido"),
  password: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .max(32, "A senha deve ter no máximo 32 caracteres"),
});

type FormValues = z.infer<typeof formSchema>;

export default function SignIn() {
  const form = useForm<FormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: FormValues) {
    console.log(values);
  }

  return (
    <div className="h-dvh">
      <div className="flex justify-center flex-col items-center px-10 gap-4 pt-32">
        <h1 className="text-2xl font-bold">Entrar</h1>
        <p>Faça login para continuar</p>

        <Form {...form}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <>
                <FormItem className="w-full">
                  <FormLabel>Email</FormLabel>
                  <Input placeholder="Email" type="email" {...field} />
                </FormItem>
              </>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <>
                <FormItem className="w-full">
                  <FormLabel>Senha</FormLabel>
                  <Input placeholder="Senha" type="password" {...field} />
                </FormItem>
              </>
            )}
          />

          <Button type="submit">Entrar</Button>
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
