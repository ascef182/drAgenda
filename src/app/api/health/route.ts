import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";

// Always evaluated at request time — never cached. Used by uptime monitors and
// load balancers to confirm the app AND its database connection are healthy.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await db.execute(sql`select 1`);
    return NextResponse.json({
      status: "ok",
      db: "up",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[health] Database check failed:", err);
    return NextResponse.json(
      {
        status: "error",
        db: "down",
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}
