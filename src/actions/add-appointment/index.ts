"use server";

import { revalidatePath } from "next/cache";

import { actionClient } from "@/lib/next-safe-action";
import { requireClinic } from "@/lib/session";
import { AppointmentService } from "@/services/appointments";

import { addAppointmentSchema } from "./schema";

export const addAppointment = actionClient
  .schema(addAppointmentSchema)
  .action(async ({ parsedInput }) => {
    const session = await requireClinic();

    await AppointmentService.create(parsedInput, session.user.clinic.id);

    revalidatePath("/appointments");
    revalidatePath("/dashboard");
  });
