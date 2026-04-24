import "dotenv/config";

import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error(
    "Missing DATABASE_URL.\n" +
      "→ Copy .env.example to .env.local and configure your PostgreSQL connection.\n" +
      "→ Quick start: docker run -d --name dragenda-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres",
  );
}

export const db = drizzle(databaseUrl, { schema });
