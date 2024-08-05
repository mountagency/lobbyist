import { type Config } from "drizzle-kit";
import { env } from "@/env";

export default {
  schema: "./src/server/db/schema.ts",
  out: "./supabase/migrate",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  tablesFilter: ["*"],
  schemaFilter: ["public"],
} satisfies Config;
