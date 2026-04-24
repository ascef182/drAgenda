import { eq } from "drizzle-orm";

import { db } from "@/db";
import { appointmentsTable } from "@/db/schema";

export const AppointmentRepository = {
  findById: (id: string) =>
    db.query.appointmentsTable.findFirst({
      where: eq(appointmentsTable.id, id),
      with: { doctor: true, patient: true },
    }),

  findByClinic: (clinicId: string) =>
    db.query.appointmentsTable.findMany({
      where: eq(appointmentsTable.clinicId, clinicId),
      with: { doctor: true, patient: true },
    }),

  // Returns appointments for a specific doctor on a given date (YYYY-MM-DD).
  // Used to compute slot availability and detect race-condition conflicts.
  findByDoctorAndDate: async (doctorId: string, dateStr: string) => {
    const all = await db.query.appointmentsTable.findMany({
      where: eq(appointmentsTable.doctorId, doctorId),
    });
    return all.filter((a) => {
      const d = new Date(a.date);
      const y = d.getUTCFullYear();
      const m = String(d.getUTCMonth() + 1).padStart(2, "0");
      const day = String(d.getUTCDate()).padStart(2, "0");
      return `${y}-${m}-${day}` === dateStr;
    });
  },

  insert: (data: typeof appointmentsTable.$inferInsert) =>
    db.insert(appointmentsTable).values(data).returning(),

  delete: (id: string) =>
    db.delete(appointmentsTable).where(eq(appointmentsTable.id, id)),
};
