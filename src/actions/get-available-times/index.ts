"use server";

import { z } from "zod";

import { actionClient } from "@/lib/next-safe-action";
import { requireClinic } from "@/lib/session";
import { AppointmentService } from "@/services/appointments";

export const getAvailableTimes = actionClient
  .schema(
    z.object({
      doctorId: z.string().uuid(),
      date: z.string().date(), // YYYY-MM-DD
    }),
  )
  .action(async ({ parsedInput }) => {
    const session = await requireClinic();

    return AppointmentService.getAvailableSlots(
      parsedInput.doctorId,
      parsedInput.date,
      session.user.clinic.id,
    );
  });
