import { eq } from "drizzle-orm";

import { db } from "@/db";
import { doctorsTable } from "@/db/schema";

export const DoctorRepository = {
  findById: (id: string) =>
    db.query.doctorsTable.findFirst({
      where: eq(doctorsTable.id, id),
    }),

  findByClinic: (clinicId: string) =>
    db.query.doctorsTable.findMany({
      where: eq(doctorsTable.clinicId, clinicId),
    }),

  upsert: async (data: typeof doctorsTable.$inferInsert) => {
    await db
      .insert(doctorsTable)
      .values(data)
      .onConflictDoUpdate({
        target: [doctorsTable.id],
        // Explicit field list prevents id/clinicId from ever being overwritten on update
        set: {
          name: data.name,
          specialty: data.specialty,
          appointmentPriceInCents: data.appointmentPriceInCents,
          availableFromWeekDay: data.availableFromWeekDay,
          availableToWeekDay: data.availableToWeekDay,
          availableFromTime: data.availableFromTime,
          availableToTime: data.availableToTime,
          avatarImageUrl: data.avatarImageUrl,
          updatedAt: data.updatedAt,
        },
      });
  },

  delete: (id: string) =>
    db.delete(doctorsTable).where(eq(doctorsTable.id, id)),
};
