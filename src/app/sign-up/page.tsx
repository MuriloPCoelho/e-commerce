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

const formSchema = z
  .object({
    name: z
      .string("Invalid name.")
      .min(2, "Invalid name.")
      .max(100, "Name too long."),
    email: z.email("Invalid email."),
    password: z
      .string("Invalid password.")
      .min(8, "Password must be at least 8 characters.")
      .max(100, "Password too long."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

export default function SignUp() {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit({ name, email, password }: FormValues) {
    const { data, error } = await authClient.signUp.email({
      name: name,
      email: email,
      password: password,
      fetchOptions: {
        onSuccess: () => {
          toast.success("Account created successfully!");
          router.push("/sign-in");
        },
        onError: (error) => {
          console.log(error);
          if (error.error.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL") {
            toast.error("A user with this email already exists.");
            form.setError("email", {
              type: "manual",
              message: "Email already registered.",
            });
            return;
          }
          // toast.error(error.error.message);
        },
      },
    });
  }

  return (
    <div className="h-dvh flex flex-col">
      <div className="flex justify-center flex-col items-center px-12 gap-4 pt-32">
        <h1 className="text-2xl font-bold">Create Account</h1>
        <p className="text-neutral-500">
          Please fill in the details to create your account.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Confirm your password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="mt-4" type="submit">
              Create Account
            </Button>
          </form>
        </Form>
        <div>
          <Link href="/sign-in" className="underline text-sm">
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
