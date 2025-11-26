import type { auth } from "@/lib/auth";

declare module "better-auth/types" {
  interface User {
    stripeCustomerId: string | null;
  }
}

export type Session = typeof auth.$Infer.Session;
