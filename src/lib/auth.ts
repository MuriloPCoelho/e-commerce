import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth({
  database: drizzleAdapter({
    user: "tb_users",
    account: "tb_accounts",
    session: "tb_sessions",
    verification: "tb_verifications",
  }, {
    provider: "pg",
  }),
});
