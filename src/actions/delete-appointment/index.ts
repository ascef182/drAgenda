"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { actionClient } from "@/lib/next-safe-action";
import { requireClinic } from "@/lib/session";
import { AppointmentService } from "@/services/appointments";

export const deleteAppointment = actionClient
  .schema(z.object({ id: z.string().uuid() }))
  .action(async ({ parsedInput }) => {
    const session = await requireClinic();

    await AppointmentService.delete(parsedInput.id, session.user.clinic.id);

    revalidatePath("/appointments");
    revalidatePath("/dashboard");
  });
