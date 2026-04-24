import { eq } from "drizzle-orm";

import { db } from "@/db";
import { patientsTable } from "@/db/schema";

export const PatientRepository = {
  findById: (id: string) =>
    db.query.patientsTable.findFirst({
      where: eq(patientsTable.id, id),
    }),

  findByClinic: (clinicId: string) =>
    db.query.patientsTable.findMany({
      where: eq(patientsTable.clinicId, clinicId),
    }),

  upsert: async (data: typeof patientsTable.$inferInsert) => {
    await db
      .insert(patientsTable)
      .values(data)
      .onConflictDoUpdate({
        target: [patientsTable.id],
        // Explicit field list prevents id/clinicId from ever being overwritten on update
        set: {
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
          sex: data.sex,
          updatedAt: data.updatedAt,
        },
      });
  },

  delete: (id: string) =>
    db.delete(patientsTable).where(eq(patientsTable.id, id)),
};
